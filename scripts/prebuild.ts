import * as fs from "fs";
import * as path from "path";

const rootDir = path.resolve(__dirname + "/..");
const packagesDir = rootDir + "/packages";
const dirs = fs.readdirSync(packagesDir, {
    withFileTypes: true,
});

const types = {cjs: "commonjs", esm: "esnext"};

const type = process.argv[2];

if (!types.hasOwnProperty(type)) {
    throw new Error("Unknown type. Should be 'cjs' or 'esm'");
}

for (const dir of dirs) {
    if (!dir.isDirectory()) {
        continue;
    }
    const pkgName = dir.name;
    const pkgDir = path.resolve(packagesDir, pkgName);
    const packageFile = path.resolve(pkgDir, "package.json");

    const info = JSON.parse(fs.readFileSync(packageFile, "utf-8"));

    const deps = Object.keys({...info.dependencies, ...info.devDependencies});
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

    const cfg = JSON.parse(fs.readFileSync(tsConfigFile, "utf-8"));

    const newCfg = {
        ...cfg,
        extends: "../../tsconfig.base.json",
        include: ["src"],
        compilerOptions: {
            ...cfg.compilerOptions,
            module: types[type],
            rootDir: "src",
            outDir: `build/${type}`,
            declarationDir: "build/types",
            tsBuildInfoFile: `${tmpDir}/${pkgName}.tsbuildinfo`,
        },
        references,
    };

    fs.writeFileSync(tsConfigFile, JSON.stringify(newCfg, null, 4));
}
