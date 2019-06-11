import {ArrBuf, Str, Var} from "@sirian/common";
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
        if (Var.isNullable(part)) {
            return "";
        }

        if (part instanceof Buffer) {
            return Str.stringify(part);
        }

        if (ArrBuf.isView(part) || ArrBuf.isBuffer(part)) {
            return Path.decoder.decode(part as DataView | ArrayBuffer);
        }

        return Str.stringify(part);
    }
}
