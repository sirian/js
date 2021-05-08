import * as proc from "child_process";
import * as fs from "fs";
import {Dirent} from "fs";

const debug = console.debug;
const VALIDATE = false;

const rootDir = __dirname + "/..";
const packagesDir = rootDir + "/packages";

const writeGreenkeepConfig = (dirs: Dirent[]) => {
    const greenkeeper = {
        groups: {
            default: {
                packages: dirs.map((dir) => `packages/${dir.name}/package.json`),
            },
        },
    };
    fs.writeFileSync(`${rootDir}/greenkeeper.json`, JSON.stringify(greenkeeper, null, 4));
};

const yarnInfo = (pkg: string) => {
    const args = ["info", "--json", pkg];
    const data = proc.spawnSync("yarn", args, {cwd: process.cwd()});
    const output = data.output.join("");
    return JSON.parse(output).data;
};

const validate = (pkgName: string, version: string) => {
    if (!VALIDATE) {
        return;
    }
    const info = yarnInfo(pkgName);

    if (version !== info.version) {
        throw new Error(`Version ${pkgName} mismatch. Remote ${info.version}, local: ${version}`);
    }
};

const writeTsConfig = (path: string, cfg: object) => {
    const data = JSON.stringify(cfg, null, 4) + "\n";
    if (fs.existsSync(path)) {
        const current = fs.readFileSync(path, "utf-8");
        if (current === data) {
            return;
        }
    }
    debug("write %o", path);
    fs.writeFileSync(path, data);
};

const getReferences = (pkg: any) =>
    Object.keys({...pkg.dependencies, ...pkg.devDependencies})
        .map((dep) => dep.match(/^@sirian\/([^\/]+)$/)?.[1])
        .filter(Boolean)
        .map((depName) => "../" + depName);

const prebuild = () => {
    const dirs = fs.readdirSync(packagesDir, {withFileTypes: true})
        .sort()
        .filter((dir) => dir.isDirectory())
        .filter((dir) => fs.existsSync(packagesDir + "/" + dir.name + "/package.json"))
    ;

    writeGreenkeepConfig(dirs);

    for (let i = 0; i < dirs.length; i++) {
        const dir = dirs[i];
        const pkgDirName = dir.name;
        debug("[%o/%o] %o", i + 1, dirs.length, pkgDirName);
        const pkgDir = packagesDir + "/" + pkgDirName;
        const packageFile = pkgDir + "/package.json";

        const pkg = JSON.parse(fs.readFileSync(packageFile, "utf-8"));

        validate(pkg.name, pkg.version);

        prebuildType(pkg, pkgDirName, "cjs", "commonjs");
        prebuildType(pkg, pkgDirName, "esm", "esnext");
    }
};

const prebuildType = (pkg: any, pkgDirName: string, type: string, module: string) => {
    const references = getReferences(pkg);
    const tmpDir = rootDir + "/tmp";

    const cfg = {
        extends: "./tsconfig.json",
        include: ["src"],
        compilerOptions: {
            noEmit: false,
            module,
            rootDir: "src",
            outDir: `build/${type}`,
            declarationDir: "build/types",
            tsBuildInfoFile: `${tmpDir}/${pkgDirName}.${type}.tsbuildinfo`,
        },
        references: references.map((p) => ({path: `${p}/tsconfig.${type}.json`})),
    };

    const pkgDir = packagesDir + "/" + pkgDirName;
    writeTsConfig(`${pkgDir}/tsconfig.${type}.json`, cfg);
};

prebuild();
