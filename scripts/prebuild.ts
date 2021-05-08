import * as proc from "child_process";
import * as fs from "fs";
import * as path from "path";

const types = {cjs: "commonjs", esm: "esnext"};

const type = process.argv[2];

if (!types.hasOwnProperty(type)) {
    throw new Error("Unknown type. Should be 'cjs' or 'esm'");
}

const rootDir = path.resolve(__dirname + "/..");
const packagesDir = rootDir + "/packages";
const dirs = fs.readdirSync(packagesDir, {withFileTypes: true})
    .sort()
    .filter((dir) => dir.isDirectory());

const greenkeeper = {
    groups: {
        default: {
            packages: dirs.map((dir) => `packages/${dir.name}/package.json`),
        },
    },
};

function yarnInfo(pkg: string) {
    const args = ["info", "--json", pkg];
    const data = proc.spawnSync("yarn", args, {cwd: process.cwd()});
    const output = data.output.join("");
    return JSON.parse(output).data;
}

fs.writeFileSync(`${rootDir}/greenkeeper.json`, JSON.stringify(greenkeeper, null, 4));

for (let i = 0; i < dirs.length; i++) {
    const dir = dirs[i];
    const pkgDirName = dir.name;
    console.log("[%d/%d] %s", i + 1, dirs.length, pkgDirName);
    const pkgDir = path.resolve(packagesDir, pkgDirName);
    const packageFile = path.resolve(pkgDir, "package.json");

    const pkg = JSON.parse(fs.readFileSync(packageFile, "utf-8"));

    // const pkgName = pkg.name;
    // const info = yarnInfo(pkgName);
    //
    // if (pkg.version !== info.version) {
    //     throw new Error(`Version ${pkgName} mismatch. Remote ${info.version}, local: ${pkg.version}`);
    // }

    const deps = Object.keys({...pkg.dependencies, ...pkg.devDependencies});
    const references = [];
    for (const dep of deps) {
        const match = dep.match(/^@sirian\/([^\/]+)$/);
        if (!match) {
            continue;
        }

        const depName = match[1];
        const depPath = path.resolve(packagesDir, depName);

        if (fs.existsSync(depPath)) {
            references.push({path: "../" + depName});
        }
    }

    const tsConfigFile = path.resolve(pkgDir, `tsconfig.json`);
    const tmpDir = path.relative(pkgDir, rootDir) + "/tmp";

    const tsConfig = fs.readFileSync(tsConfigFile, "utf-8");

    const cfg = JSON.parse(tsConfig);
    const compilerOptions = {
        ...cfg.compilerOptions,
        module: types[type],
        outDir: `build/${type}`,
        declarationDir: "build/types",
        tsBuildInfoFile: `${tmpDir}/${pkgDirName}.tsbuildinfo`,
    };

    const newCfg = {
        ...cfg,
        extends: "../../tsconfig.base.json",
        include: ["src"],
        compilerOptions,
        references,
    };

    fs.writeFileSync(tsConfigFile, JSON.stringify(newCfg, null, 4));
}
