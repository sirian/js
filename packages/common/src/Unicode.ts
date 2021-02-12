import {Instance, Primitive} from "@sirian/ts-extra-types";
import {toArray} from "./Arr";
import {ByteArraySource, TypedArrayConstructor} from "./ByteArray";
import {tryCatch} from "./Fn";
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

export const convertBytes = <T extends TypedArrayConstructor>(from: ArrayBuffer | ArrayBufferView, to: T) => {
    const bytes = toBytes(from);
    const bytesPerElement = to.BYTES_PER_ELEMENT;
    const length = bytes.length;
    const tmp = new Uint8Array(bytesPerElement * Math.ceil(length / bytesPerElement));
    tmp.set(bytes);
    return new to(tmp.buffer) as Instance<T>;
};

export const toUTF =
    (input?: ByteArraySource | ArrayLike<number> | Iterable<number> | Primitive) =>
        isPrimitive(input) ? stringifyVar(input) : new TextDecoder().decode(toBytes(input));

export const isUTF8String = (source: string) =>
    tryCatch(() => source === decodeURIComponent(encodeURIComponent(source)), false);
