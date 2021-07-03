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

export type TypedArray =
    | Int8Array
    | Int16Array
    | Int32Array
    | Uint8Array
    | Uint8ClampedArray
    | Uint16Array
    | Uint32Array
    | Float32Array
    | Float64Array;

export type ByteArraySource = null | undefined | string | ArrayBuffer | ArrayBufferView;

export type ByteInput = ByteArraySource | ArrayLike<number> | Iterable<number> | Primitive;

let textEncoder: TextEncoder;
let textDecoder: TextDecoder;

export const toBytes = (source?: ByteInput): Uint8Array => {
    // eslint-disable-next-line unicorn/no-null
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

export const concatBytes = <T extends TypedArrayConstructor>(ctor: T, ...sources: Array<Instance<T>>) => {
    let length = sources.reduce((len, source) => len + source.length, 0);
    const result = new ctor(length);
    sources.reduceRight<any>((tmp, s) => result.set(s, length -= s.length), 0);
    return result;
};

export const toUTF = (input?: ByteInput) =>
    // eslint-disable-next-line unicorn/no-null
    "" === input || null == input || isSymbol(input)
    ? ""
    : (isPrimitive(input) ? stringifyVar(input) : (textDecoder ??= new TextDecoder()).decode(toBytes(input)));

export const isUTF8String = (source: string) =>
    tryCatch(() => source === decodeURIComponent(encodeURIComponent(source)), false);
