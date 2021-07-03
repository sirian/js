/* eslint-disable unicorn/prefer-module */
import * as fs from "node:fs";
import * as path from "node:path";
import packageJson from "package-json";
import {PackageJson} from "type-fest";

export const rootDir = path.dirname(__dirname);
export const packagesDir = path.join(rootDir, "packages");
export const debug = console.debug;
export const error = console.error;

export const getPackageDirName = (packageNameOrPath: string) => path.basename(packageNameOrPath);
export const getPackageDir = (packageNameOrPath: string) => path.join(packagesDir, path.basename(packageNameOrPath));
export const readJSON = <T>(file: string) => JSON.parse(fs.readFileSync(file, "utf-8")) as T;
export const readPackageJSON = (packageName: string) => readJSON<PackageJson>(getPackageDir(packageName) + "/package.json");
export const writeJSON = (file: string, data: unknown) => fs.writeFileSync(file, JSON.stringify(data, void 0, 4) + "\n");

export const validate = async (pkgs: PackageJson[]) => {
    debug("Validate package versions");

    const promises = pkgs.map(async (pkg) => {
        const info = await packageJson(pkg.name!);

        return {
            name: pkg.name,
            private: pkg.private,
            local: pkg.version,
            remote: info.version,
        };
    });

    const results = await Promise.all(promises);

    const table = results
        .filter(({local, remote}) => local !== remote)

    console.table(table);
};
