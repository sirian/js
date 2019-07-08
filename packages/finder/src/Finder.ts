import {Arr} from "@sirian/common";
import {File, Filesystem, FileType, RecursiveDirectoryIterator} from "@sirian/filesystem";
import {AppendIterator, BaseIterator, EveryFilter, FilterIterator, IFilter} from "@sirian/iterator";
import {FilenameFilter} from "./FilenameFilter";

export interface FinderOptions {
    fs: Filesystem;
    types: FileType[];
    names: Array<string | RegExp>;
    filters: Array<IFilter<File>>;
    maxDepth: number;
    dirs: string[];
}

export class Finder extends BaseIterator<File> {
    protected options: FinderOptions;

    constructor(options: Partial<FinderOptions> = {}) {
        super();
        this.options = {
            fs: Filesystem.local,
            types: [],
            names: [],
            filters: [],
            dirs: [],
            maxDepth: Number.MAX_SAFE_INTEGER,
            ...options,
        };
    }

    public static find(options: Partial<FinderOptions> = {}) {
        return new this(options);
    }

    public type(type: FileType | FileType[]) {
        this.options.types = Arr.cast(type);
        return this;
    }

    public directories() {
        return this.type(FileType.DIR);
    }

    public files() {
        return this.type(FileType.FILE);
    }

    public maxDepth(depth: number) {
        this.options.maxDepth = depth;
        return this;
    }

    public name(names: string | RegExp | Array<string | RegExp>) {
        this.options.names = Arr.cast(names);
        return this;
    }

    public filter(filter: IFilter<File>) {
        this.options.filters.push(filter);
        return this;
    }

    public in(dirs: string | string[]) {
        this.options.dirs = Arr.cast(dirs);
        return this;
    }

    public async* [Symbol.asyncIterator]() {
        const {maxDepth, dirs, fs} = this.options;
        const it = new AppendIterator<File>();

        for (const dir of dirs) {
            it.add(new RecursiveDirectoryIterator(dir, {
                maxDepth,
                fs,
                onlyLeaves: false,
            }));
        }

        const iterator = new FilterIterator(it, this.createFilter());

        yield* iterator;
    }

    protected createFilter(): IFilter<File> {
        const {types, names, filters} = this.options;

        const filter = new EveryFilter<File>();

        if (types.length) {
            filter.add((file) => file.isType(...types));
        }

        if (names.length) {
            filter.add(new FilenameFilter(names));
        }

        filter.add(filters);

        return filter;
    }
}
