import {Var, XMap} from "@sirian/common";
import {InvalidPropertyPathError, OutOfBoundsError} from "./Error";

export type Path = string | number;

export interface PropertyPathPart {
    readonly key: string;
    readonly isIndex: boolean;
}

export class PropertyPath {
    protected static readonly cache = new XMap((path) => new PropertyPath(path));

    public readonly parts: PropertyPathPart[];
    public readonly keys: readonly string[];
    public readonly path: string;

    constructor(arg: Path) {
        const path = Var.stringify(arg);

        if (!path) {
            const msg = `The property path should be non empty string. Given: ${path}`;
            throw new InvalidPropertyPathError(msg);
        }

        this.path = path;
        this.parts = PropertyPath.parse(path);
        this.keys = this.parts.map((part) => part.key);
    }

    public get length() {
        return this.parts.length;
    }

    public get last() {
        return this.getPart(this.length - 1);
    }

    public static parse(path: string) {
        const re = /^\[([^\]]+)]|(?:^|\.)([^.[]+)/;

        let pos = 0;
        const parts = [];

        while (pos < path.length) {
            const matches = path.substr(pos).match(re);

            if (!matches) {
                break;
            }

            const [text, index, key] = matches;

            parts.push({
                key: key || index,
                isIndex: Var.isNumeric(index),
            });

            pos += text.length;
        }

        if (pos !== path.length) {
            const msg = `Could not parse property path "${path}". Unexpected token "${path[pos]}" at position ${pos}"`;
            throw new InvalidPropertyPathError(msg);
        }
        return parts;
    }

    public static from(path: PropertyPath | Path) {
        if (Var.isInstanceOf(path, PropertyPath)) {
            return path;
        }

        return this.cache.ensure(path);
    }

    public getPart(index: number) {
        if (index >= 0 && index < this.parts.length) {
            return this.parts[index];
        }

        throw new OutOfBoundsError(`The index ${index} is not within the property path "${this.path}"`);
    }

    public toString() {
        return this.path;
    }

    public* [Symbol.iterator]() {
        return yield* this.parts;
    }
}
