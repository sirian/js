import {ArrBuf, ArrBufTarget} from "./ArrBuf";

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

export class TypedArr {
    public static create<T extends TypedArray>(constructor: TypedArrayConstructor<T>, source: ArrBufTarget | DataView) {
        const sourceBuffer = ArrBuf.getBuffer(source);
        const buffer = ArrBuf.align(sourceBuffer, constructor.BYTES_PER_ELEMENT);

        return new constructor(buffer);
    }
}
