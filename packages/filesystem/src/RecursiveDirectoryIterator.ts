import {RecursiveIterator, RecursiveIteratorOptions, TransformIterator} from "@sirian/iterator";
import {DirectoryIterator} from "./DirectoryIterator";
import {File} from "./File";
import {Filesystem} from "./Filesystem";

export interface RecursiveDirectoryIteratorOptions extends RecursiveIteratorOptions {
    fs: Filesystem;
    followSymlinks: boolean;
    basedir: string;
    stats: boolean;
}

export class RecursiveDirectoryIterator extends RecursiveIterator<File> {
    constructor(path: string, opts: Partial<RecursiveDirectoryIteratorOptions> = {}) {

        const options: RecursiveDirectoryIteratorOptions = {
            onlyLeaves: false,
            fs: Filesystem.local,
            followSymlinks: false,
            maxDepth: Number.MAX_SAFE_INTEGER,
            basedir: path,
            stats: false,
            ...opts,
        };

        const iterator = RecursiveDirectoryIterator.createIterator(path, options);

        super(iterator, options);
    }

    protected static createIterator(path: string, options: RecursiveDirectoryIteratorOptions) {
        const iterator = new DirectoryIterator({
            path,
            fs: options.fs,
        });

        return new TransformIterator(iterator, (file) => this.createContext(file, options));
    }

    protected static createContext(file: File, options: RecursiveDirectoryIteratorOptions) {
        file.basedir = options.basedir;

        return {
            value: file,
            hasChildren: () => file.isDir(),
            getChildren: () => RecursiveDirectoryIterator.createIterator(file.path, options),
        };
    }
}
