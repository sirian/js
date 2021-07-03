import * as fs from "fs";
import * as util from "util";

import {File, FileType} from "./File";
import {Path} from "./Path";

export interface ReadDirOptions {
    stats: boolean;
}

export class Filesystem {
    public static local = new Filesystem();

    public static getFileType(item: fs.Dirent | fs.Stats) {
        const map: Array<[FileType, () => boolean]> = [
            [FileType.FILE, item.isFile],
            [FileType.DIR, item.isDirectory],
            [FileType.SYMLINK, item.isSymbolicLink],
            [FileType.FIFO, item.isFIFO],
            [FileType.SOCKET, item.isSocket],
            [FileType.CHARACTER_DEVICE, item.isCharacterDevice],
            [FileType.BLOCK_DEVICE, item.isBlockDevice],
        ];

        for (const [type, fn] of map) {
            if (fn.call(item)) {
                return type;
            }
        }
        return FileType.UNKNOWN;
    }

    public async load(path: string) {
        const fn = util.promisify(fs.stat);
        const stats = await fn(path);
        return new File({
            path,
            type: Filesystem.getFileType(stats),
            stats,
        });
    }

    public async isReadable(path: string) {
        try {
            await util.promisify(fs.access)(path, fs.constants.R_OK);
            return true;
        } catch {
            return false;
        }
    }

    public async isWritable(path: string) {
        try {
            await util.promisify(fs.access)(path, fs.constants.W_OK);
            return true;
        } catch {
            return false;
        }
    }

    public async isExists(path: string) {
        try {
            await util.promisify(fs.access)(path, fs.constants.F_OK);
            return true;
        } catch {
            return false;
        }
    }

    public async readDir(path: string, options: Partial<ReadDirOptions> = {}) {
        const fn = util.promisify(fs.readdir);

        if (options.stats) {
            const names = await fn(path);
            const paths = names.map((name) => Path.join(path, name));

            return Promise.all(paths.map((p) => this.load(p)));
        } else {
            const items = await fn(path, {withFileTypes: true});

            return items.map((item) => new File({
                path: Path.join(path, item.name),
                type: Filesystem.getFileType(item),
            }));
        }
    }
}
