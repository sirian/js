import * as fs from "node:fs";
import {PackageJson} from "type-fest";
import {debug, getPackageDir, packagesDir, readPackageJSON, rootDir, validate, writeJSON} from "./util";

const VALIDATE = process.argv.includes("--validate");

const getReferences = (pkg: PackageJson) =>
    Object.keys({...pkg.dependencies, ...pkg.devDependencies})
        .map((dep) => /^@sirian\/([^/]+)$/.exec(dep)?.[1])
        .filter(Boolean)
        .map((depName) => "../" + depName);

const prebuild = async () => {
    const packages = fs
        .readdirSync(packagesDir, {withFileTypes: true})
        .sort()
        .filter((dir) => dir.isDirectory())
        .map((dir) => ({
            name: dir.name,
            pkg: readPackageJSON(dir.name),
        }))
    ;
//        .filter((name) => fs.existsSync(getPackageDir(name) + "/package.json"));

    if (VALIDATE) {
        await validate(packages.map(({pkg}) => pkg));
    }

    const publicAccess = [];

    debug("Prebuild");
    for (const [i, {name, pkg}] of packages.entries()) {
        debug("[%o/%o] %o ", i + 1, packages.length, name);

        if (!pkg.name || !pkg.version) {
            continue;
        }

        if (!pkg.private) {
            publicAccess.push(name);
        }

        prebuildType(pkg, name, "cjs", "CommonJS");
        prebuildType(pkg, name, "esm", "ESNext");
    }
};

const prebuildType = (pkg: any, pkgName: string, type: string, tsModule: "ESNext" | "CommonJS") => {
    const references = getReferences(pkg);
    const tmpDir = rootDir + "/tmp";

    const cfg = {
        extends: "./tsconfig.json",
        include: ["src"],
        compilerOptions: {
            noEmit: false,
            module: tsModule,
            rootDir: "src",
            outDir: `build/${type}`,
            declarationDir: "build/types",
            tsBuildInfoFile: `${tmpDir}/${pkgName}.${type}.tsbuildinfo`,
        },
        references: references.map((p) => ({path: `${p}/tsconfig.${type}.json`})),
    };

    writeJSON(getPackageDir(pkgName) + `/tsconfig.${type}.json`, cfg);
};

prebuild().catch(console.error);
