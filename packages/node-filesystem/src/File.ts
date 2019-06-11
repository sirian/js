import * as fs from "fs";
import * as pathUtil from "path";

export const enum FileType {
    UNKNOWN,
    FILE,
    DIR,
    BLOCK_DEVICE,
    CHARACTER_DEVICE,
    SYMLINK,
    FIFO,
    SOCKET,
}

export interface FileInfo {
    path: string;
    basedir?: string;
    type: FileType;
    stats?: fs.Stats;
}

export class File {
    public readonly path!: string;
    public readonly name: string;
    public readonly type: FileType;
    public basedir: string;
    public stats?: fs.Stats;

    constructor(info: FileInfo) {
        this.path = info.path;
        this.type = info.type;
        this.stats = info.stats;
        this.basedir = info.basedir || ".";
        this.name = pathUtil.basename(this.path);
    }

    get relativePath() {
        return pathUtil.relative(this.basedir, this.path);
    }

    public isType(...types: FileType[]) {
        return types.includes(this.type);
    }

    public isFile() {
        return this.isType(FileType.FILE);
    }

    public isDir() {
        return this.isType(FileType.DIR);
    }
}
