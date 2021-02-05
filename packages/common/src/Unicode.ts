import {Primitive} from "@sirian/ts-extra-types";
import {toArray} from "./Arr";
import {ByteArraySource} from "./ByteArray";
import {isArrayBuffer, isArrayBufferView, isPrimitive, stringifyVar} from "./Var";

declare class TextEncoder {
    public encode(input?: string): Uint8Array;
}

declare class TextDecoder {
    public decode(input?: Uint8Array): string;
}

export const toBytes = (source?: ByteArraySource | ArrayLike<number> | Iterable<number> | Primitive) => {
    if (isPrimitive(source)) {
        return new TextEncoder().encode(stringifyVar(source));
    }

    if (isArrayBufferView(source)) {
        const {buffer, byteOffset = 0, byteLength} = source;
        source = buffer.slice(byteOffset, byteOffset + byteLength);
        return new Uint8Array(source);
    }

    return new Uint8Array(isArrayBuffer(source) ? source : toArray(source));
};
export const toUTF =
    (input?: ByteArraySource | ArrayLike<number> | Iterable<number> | Primitive) =>
        isPrimitive(input) ? stringifyVar(input) : new TextDecoder().decode(toBytes(input));

export const isUTF8String = (source: string) => {
    try {
        return source === decodeURIComponent(encodeURIComponent(source));
    } catch (e) {
        return false;
    }
};
