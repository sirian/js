import {isArray, isInstanceOf, isNumber, isNumeric, XMap} from "@sirian/common";
import {InvalidPropertyPathError} from "./Error";

export type PathKey = string | number;

export type Path = PathKey | PathKey[];

export interface PathElement {
    readonly key: PathKey;
    readonly asIndex: boolean;
}

export class PropertyPath extends Array<PathElement> {
    protected static readonly cache = new XMap((path) => new PropertyPath(path));

    constructor(arg: Path) {
        super();
        const parts = PropertyPath.parse(arg);

        if (!parts.length) {
            const msg = `The property path should be non empty. Given: ${arg}`;
            throw new InvalidPropertyPathError(msg);
        }

        this.push(...parts);
    }

    public static get [Symbol.species]() {
        return Array;
    }

    public static parse(path: Path): PathElement[] {
        if (isArray(path)) {
            return path.map((key) => ({
                key,
                asIndex: isNumber(key),
            }));
        }

        if (isNumber(path)) {
            return [{
                key: path,
                asIndex: true,
            }];
        }

        const re = /^\[([^\]]+)]|(?:^|\.)([^.[]+)/;

        let pos = 0;
        const parts = [];

        while (pos < path.length) {
            const matches = path.substr(pos).match(re);

            if (!matches) {
                break;
            }

            const [text, index, key] = matches;

            const asIndex = index !== undefined;

            parts.push({
                key: asIndex ? (isNumeric(index) ? +index : index) : key,
                asIndex,
            });

            pos += text.length;
        }

        if (pos !== path.length) {
            const msg = `Could not parse property path "${path}". Unexpected token "${path[pos]}" at position ${pos}"`;
            throw new InvalidPropertyPathError(msg);
        }
        return parts;
    }

    public static from<T extends PropertyPath>(path: T): T;
    public static from(path: Path): PropertyPath;
    public static from(path: PropertyPath | Path) {
        if (isInstanceOf(path, PropertyPath)) {
            return path;
        }

        return this.cache.ensure(path);
    }

    public get last() {
        return this[this.length - 1];
    }

    public getKeys() {
        return this.map((v) => v.key);
    }

    public toString() {
        return this.map(({asIndex, key}) => asIndex ? `[${key}]` : `.${key}`).join("");
    }
}
