import * as fs from "fs";
import {getPackageDir, packagesDir, readPackageJSON, rootDir, validate, writeJSON} from "./util";

const debug = console.debug;
const VALIDATE = false;

const getReferences = (pkg: any) =>
    Object.keys({...pkg.dependencies, ...pkg.devDependencies})
        .map((dep) => dep.match(/^@sirian\/([^\/]+)$/)?.[1])
        .filter(Boolean)
        .map((depName) => "../" + depName);

const prebuild = () => {
    const packages = fs.readdirSync(packagesDir, {withFileTypes: true})
        .sort()
        .filter((dir) => dir.isDirectory())
        .map((dir) => dir.name)
        .filter((name) => fs.existsSync(getPackageDir(name) + "/package.json"))
    ;

    const publicAccess = [];

    for (const [i, name] of packages.entries()) {
        debug("[%o/%o] %o", i + 1, packages.length, name);

        const pkg = readPackageJSON(name);

        if (!pkg.private) {
            publicAccess.push(name);
        }

        if (VALIDATE) {
            validate(pkg.name, pkg.version);
        }

        prebuildType(pkg, name, "cjs", "commonjs");
        prebuildType(pkg, name, "esm", "esnext");
    }

    writeJSON(rootDir + `/greenkeeper.json`, {
        groups: {
            default: {
                packages: publicAccess.map((name) => `packages/${name}/package.json`),
            },
        },
    });
};

const prebuildType = (pkg: any, pkgName: string, type: string, module: string) => {
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
            tsBuildInfoFile: `${tmpDir}/${pkgName}.${type}.tsbuildinfo`,
        },
        references: references.map((p) => ({path: `${p}/tsconfig.${type}.json`})),
    };

    writeJSON(getPackageDir(pkgName) + `/tsconfig.${type}.json`, cfg);
};

prebuild();
