import {isArray, isNumber, isNumeric, isPrimitive, XMap} from "@sirian/common";
import {InvalidPropertyPathError} from "./Error";

export type PathKey = string | number;

export type Path = PathKey | PathKey[];

export type PathElement = [key: PathKey, asIndex: boolean];

function parse(path: Path): PathElement[] {
    if (isArray(path)) {
        return path.map((key) => [key, isNumber(key)]);
    }

    if (isNumber(path)) {
        return [[path, true]];
    }

    const re = /^\[([^\]]+)]|(?:^|\.)([^.[]+)/;

    let pos = 0;
    const parts: PathElement[] = [];

    while (pos < path.length) {
        const matches = re.exec(path.slice(pos));

        if (!matches) {
            break;
        }

        const [text, index, key] = matches;

        const asIndex = index !== undefined;

        parts.push([
            asIndex ? (isNumeric(index) ? +index : index) : key,
            asIndex,
        ]);

        pos += text.length;
    }

    if (pos !== path.length) {
        const msg = `Could not parse property path "${path}". Unexpected token "${path[pos]}" at position ${pos}"`;
        throw new InvalidPropertyPathError(msg);
    }

    return parts;
}

const _cache = new XMap(parse);

export const parsePropertyPath = (path: Path) => {
    const propPath = isPrimitive(path) ? _cache.ensure(path) : parse(path);

    if (!propPath.length) {
        const msg = `The property path should be non empty. Given: ${path}`;
        throw new InvalidPropertyPathError(msg);
    }

    return propPath;
};

export const propertyPathToString = (path: PathElement[]) =>
    path.map(([key, asIndex]) => asIndex ? `[${key}]` : `.${key}`).join("");
