import {isRegExp} from "@sirian/common";
import {File} from "@sirian/filesystem";
import {IFilter} from "@sirian/iterator";
import {Glob} from "./Glob";

export class FilenameFilter implements IFilter<File> {
    protected patterns: RegExp[];

    constructor(patterns: Array<string | RegExp>) {
        this.patterns = patterns.map((pattern) => isRegExp(pattern) ? pattern : Glob.toRegex(pattern));
    }

    public test(file: File) {
        const name = file.name;
        return this.patterns.some((pattern) => pattern.test(name));
    }
}
