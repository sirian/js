import proc from "child_process";
import * as fs from "fs";
import * as path from "path";

export const rootDir = path.dirname(__dirname);
export const packagesDir = path.join(rootDir, "packages");

export const getPackageDirName = (packageNameOrPath: string) => path.basename(packageNameOrPath);
export const getPackageDir = (packageNameOrPath: string) => path.join(packagesDir, path.basename(packageNameOrPath));
export const readJSON = (file: string) => JSON.parse(fs.readFileSync(file, "utf-8"));
export const readPackageJSON = (packageName: string) => readJSON(getPackageDir(packageName) + "/package.json");
export const writeJSON = (file: string, data: unknown) => fs.writeFileSync(file, JSON.stringify(data, null, 4) + "\n");

export const yarnInfo = (pkg: string) => {
    const args = ["info", "--json", pkg];
    const data = proc.spawnSync("yarn", args, {cwd: process.cwd()});
    const output = data.output.join("");
    return JSON.parse(output).data;
};

export const validate = (pkgName: string, version: string) => {
    const info = yarnInfo(pkgName);

    if (version !== info.version) {
        throw new Error(`Version ${pkgName} mismatch. Remote ${info.version}, local: ${version}`);
    }
};
