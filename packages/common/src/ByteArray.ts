import {Instance} from "@sirian/ts-extra-types";
import {bytesToString, stringToBytes} from "./Unicode";
import {isArrayBuffer, isArrayBufferView, isInstanceOf, isString} from "./Var";

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

export type ByteArrayInput = string | ArrayBuffer;

export class ByteArray extends Uint8Array {
    public static from(str: ArrayBuffer | string): ByteArray;
    public static from(str: ArrayLike<number>): ByteArray;
    public static from(arrayLike: Iterable<number>, mapfn?: (v: number, k: number) => number, thisArg?: any): ByteArray;
    public static from<T>(arrayLike: ArrayLike<T>, mapfn: (v: T, k: number) => number, thisArg?: any): ByteArray;
    public static from(source: any, ...args: any) {
        if (isString(source)) {
            return new this(stringToBytes(source).buffer);
        }

        if (isArrayBuffer(source)) {
            return new ByteArray(source);
        }

        if (isArrayBufferView(source)) {
            const {buffer, byteOffset, byteLength} = source;
            return new this(buffer.slice(byteOffset, byteOffset + byteLength));
        }

        return super.from(source, ...args);
    }

    public static stringify(buf: ByteArrayInput) {
        return isString(buf) ? buf : ByteArray.from(buf).toString();
    }

    public static convert<T extends TypedArrayConstructor>(buf: ByteArrayInput, to: T) {
        return isInstanceOf(buf, to) ? buf : ByteArray.from(buf).to(to);
    }

    public to<T extends TypedArrayConstructor>(typedArrayCtor: T) {
        const bytesPerElement = typedArrayCtor.BYTES_PER_ELEMENT;
        const elements = Math.ceil(this.byteLength / bytesPerElement);
        const bufferView = new ByteArray(bytesPerElement * elements);
        bufferView.set(this, 0);
        return new typedArrayCtor(bufferView.buffer) as Instance<T>;
    }

    public toString(): string {
        return bytesToString(this);
    }
}
