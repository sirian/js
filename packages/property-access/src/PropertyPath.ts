import {Var, XMap} from "@sirian/common";
import {InvalidPropertyPathError} from "./Error";

export type _Path = string | number;

export type Path = _Path | _Path[];

export interface PathElement {
    readonly key: string | number;
    readonly asIndex: boolean;
}

export class PropertyPath extends Array<PathElement> {
    protected static readonly cache = new XMap((path) => new PropertyPath(path));

    constructor(arg: Path) {
        super();
        const path = Var.stringify(arg);
        const parts = PropertyPath.parse(path);

        if (!path) {
            const msg = `The property path should be non empty string. Given: ${path}`;
            throw new InvalidPropertyPathError(msg);
        }

        this.push(...parts);
    }

    public static get [Symbol.species]() {
        return Array;
    }

    public get last() {
        return this[this.length - 1];
    }

    public static parse(path: Path): PathElement[] {
        if (Var.isArray(path)) {
            return path.map((key) => ({
                key,
                asIndex: Var.isNumber(key),
            }));
        }

        if (Var.isNumber(path)) {
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
                key: asIndex ? (Var.isNumeric(index) ? +index : index) : key,
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
        if (Var.isInstanceOf(path, PropertyPath)) {
            return path as any;
        }

        return this.cache.ensure(path) as any;
    }

    public getKeys() {
        return [...this].map((v) => v.key);
    }

    public toString() {
        const result: string[] = [];
        for (const part of this) {
            result.push(part.asIndex ? `[${part.key}]` : `.${part.key}`);
        }
        return result.join("");
    }
}
