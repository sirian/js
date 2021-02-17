import {isArrayBuffer, isArrayBufferView, isNullish, stringifyStr} from "@sirian/common";
import {PathLike} from "fs";
import * as pathUtil from "path";
import * as util from "util";

export type PathPart = string | ArrayBufferView | number;

export class Path {
    protected static decoder = new util.TextDecoder();

    public static join(...parts: PathPart[]) {
        const paths = parts.map(Path.stringify);
        return pathUtil.join(...paths);
    }

    public static relative(from: PathLike, to: PathLike) {
        return pathUtil.relative(this.stringify(from), this.stringify(to));
    }

    public static stringify(part: PathPart | PathLike) {
        if (isNullish(part)) {
            return "";
        }

        if (part instanceof Buffer) {
            return stringifyStr(part);
        }

        if (isArrayBufferView(part) || isArrayBuffer(part)) {
            return Path.decoder.decode(part as DataView | ArrayBuffer);
        }

        return stringifyStr(part);
    }
}
