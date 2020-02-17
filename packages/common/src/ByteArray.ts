import {Instance} from "@sirian/ts-extra-types";
import {ArrBuf, ArrBufTarget} from "./ArrBuf";
import {Unicode} from "./Unicode";
import {isArrayBuffer, isArrayBufferView, isString} from "./Var";

export type TypedArray =
    Int8Array
    | Int16Array
    | Int32Array
    | Uint8Array
    | Uint8ClampedArray
    | Uint16Array
    | Uint32Array
    | Float32Array
    | Float64Array;

export interface TypedArrayConstructor<T extends TypedArray = TypedArray> {
    readonly BYTES_PER_ELEMENT: number;

    new(arrayOrArrayBuffer: ArrayBuffer): T;
}

export class ByteArray extends Uint8Array {
    public static from(arrayLike: ArrBufTarget | ArrayLike<number>): ByteArray;
    public static from<T>(arrayLike: Iterable<number>, mapfn: (v: T, k: number) => number, thisArg?: any): ByteArray;
    public static from(source: any) {
        if (isString(source) || isArrayBuffer(source) || isArrayBufferView(source)) {
            return new ByteArray(ArrBuf.getBuffer(source));
        }

        return new ByteArray(super.from(source));
    }

    public to<T extends TypedArrayConstructor>(typedArrayCtor: T) {
        const buffer = ArrBuf.align(this.buffer, typedArrayCtor.BYTES_PER_ELEMENT);
        return new typedArrayCtor(buffer) as Instance<T>;
    }

    public toString(): string {
        return Unicode.bytesToString(this);
    }
}
