import {convertBytes, toBytes, toUTF} from "./Unicode";

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
    public static from(input: ByteArraySource | ArrayLike<number> | Iterable<number>) {
        return new ByteArray(toBytes(input));
    }

    public static stringify(buf: ByteArraySource) {
        return toUTF(buf);
    }

    public static convert<T extends TypedArrayConstructor>(buf: ByteArraySource, to: T) {
        return ByteArray.from(buf).to(to);
    }

    public to<T extends TypedArrayConstructor>(typedArrayCtor: T) {
        return convertBytes(this, typedArrayCtor);
    }

    public toString(): string {
        return toUTF(this);
    }
}
