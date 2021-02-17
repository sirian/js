import {Instance, Primitive} from "@sirian/ts-extra-types";
import {toArray} from "./Arr";
import {tryCatch} from "./Fn";
import {isPrimitive} from "./Is";
import {stringifyVar} from "./Stringify";
import {isArrayBufferLike, isArrayBufferView} from "./Var";

declare class TextEncoder {
    public encode(input?: string): Uint8Array;
}

declare class TextDecoder {
    public decode(input?: Uint8Array): string;
}

export type TypedArrayConstructor =
    | Int8ArrayConstructor
    | Int16ArrayConstructor
    | Int32ArrayConstructor
    | Uint8ArrayConstructor
    | Uint8ClampedArrayConstructor
    | Uint16ArrayConstructor
    | Uint32ArrayConstructor
    | Float32ArrayConstructor
    | Float64ArrayConstructor;

export type ByteArraySource = null | undefined | string | ArrayBuffer | ArrayBufferView;

export type ByteInput = ByteArraySource | ArrayLike<number> | Iterable<number> | Primitive;

export const toBytes = (source?: ByteInput): Uint8Array => {
    if (isPrimitive(source)) {
        return new TextEncoder().encode(stringifyVar(source));
    }

    if (isArrayBufferView(source)) {
        return new Uint8Array(source.buffer.slice(source.byteOffset, source.byteOffset + source.byteLength));
    }

    return new Uint8Array(isArrayBufferLike(source) ? source : toArray(source));
};

export const convertBytes = <T extends TypedArrayConstructor>(from: ArrayBuffer | ArrayBufferView, to: T) => {
    const bytes = toBytes(from);
    const bytesPerElement = to.BYTES_PER_ELEMENT;
    const length = bytes.length;
    const tmp = new Uint8Array(bytesPerElement * Math.ceil(length / bytesPerElement));
    tmp.set(bytes);
    return new to(tmp.buffer) as Instance<T>;
};

export const toUTF = (input?: ByteInput) =>
    isPrimitive(input) ? stringifyVar(input) : new TextDecoder().decode(toBytes(input));

export const isUTF8String = (source: string) =>
    tryCatch(() => source === decodeURIComponent(encodeURIComponent(source)), false);