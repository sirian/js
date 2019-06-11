import {BaseIterator} from "@sirian/iterator";
import {File} from "./File";
import {Filesystem} from "./Filesystem";

export interface DirectoryIteratorOptions {
    path: string;
    basedir?: string;
    stats?: boolean;
    fs?: Filesystem;
}

export class DirectoryIterator extends BaseIterator<File> {
    protected options: Required<DirectoryIteratorOptions>;

    constructor(options: DirectoryIteratorOptions) {
        super();
        this.options = {
            fs: Filesystem.local,
            stats: false,
            basedir: options.path,
            ...options,
        };
    }

    public async* [Symbol.asyncIterator]() {
        const {fs, path, stats, basedir} = this.options;

        const items = await fs.readDir(path, {stats});
        for (const item of items) {
            item.basedir = basedir;
            yield item;
        }
    }
}
