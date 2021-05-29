import {Instance, Primitive} from "@sirian/ts-extra-types";
import {toArray} from "./Arr";
import {isPrimitive, isSymbol} from "./Is";
import {tryCatch} from "./Ref";
import {stringifyVar} from "./Stringify";
import {isArrayBufferLike, isArrayBufferView, isInstanceOf} from "./Var";

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

let textEncoder: TextEncoder;
let textDecoder: TextDecoder;

export const toBytes = (source?: ByteInput): Uint8Array => {
    if ("" === source || null == source) {
        return new Uint8Array();
    }

    if (isInstanceOf(source, Uint8Array)) {
        return source;
    }

    if (isPrimitive(source)) {
        return (textEncoder ??= new TextEncoder()).encode(stringifyVar(source));
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
    "" === input || null == input || isSymbol(input)
    ? ""
    : (isPrimitive(input) ? stringifyVar(input) : (textDecoder ??= new TextDecoder()).decode(toBytes(input)));

export const isUTF8String = (source: string) =>
    tryCatch(() => source === decodeURIComponent(encodeURIComponent(source)), false);
