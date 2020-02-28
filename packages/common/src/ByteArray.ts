import {Instance} from "@sirian/ts-extra-types";
import {bytesToString, stringToBytes} from "./Unicode";
import {isArrayBuffer, isArrayBufferView, isNullish, isPrimitive, isString, stringifyVar} from "./Var";

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

export class ByteArray extends Uint8Array {
    public static from(str: ByteArraySource): ByteArray;
    public static from(str: ArrayLike<number>): ByteArray;
    public static from(arrayLike: Iterable<number>, mapfn?: (v: number, k: number) => number, thisArg?: any): ByteArray;
    public static from<T>(arrayLike: ArrayLike<T>, mapfn: (v: T, k: number) => number, thisArg?: any): ByteArray;
    public static from(source: any, ...args: any) {
        if (isNullish(source)) {
            return new this();
        }

        if (isString(source)) {
            return new this(stringToBytes(source).buffer);
        }

        if (isArrayBuffer(source)) {
            return new this(source);
        }

        if (isArrayBufferView(source)) {
            const {buffer, byteOffset, byteLength} = source;
            return new this(buffer.slice(byteOffset, byteOffset + byteLength));
        }

        return super.from(source, ...args);
    }

    public static stringify(buf: ByteArraySource) {
        return isPrimitive(buf) ? stringifyVar(buf) : this.from(buf).toString();
    }

    public static convert<T extends TypedArrayConstructor>(buf: ByteArraySource, to: T) {
        return this.from(buf).to(to);
    }

    public to<T extends TypedArrayConstructor>(typedArrayCtor: T) {
        const bytesPerElement = typedArrayCtor.BYTES_PER_ELEMENT;
        const elements = Math.ceil(this.byteLength / bytesPerElement);
        const bufferView = new Uint8Array(bytesPerElement * elements);
        bufferView.set(this, 0);
        return new typedArrayCtor(bufferView.buffer) as Instance<T>;
    }

    public toString(): string {
        return bytesToString(this);
    }
}
