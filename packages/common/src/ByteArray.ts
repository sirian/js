import {Instance} from "@sirian/ts-extra-types";
import {toBytes, toUTF} from "./Unicode";
import {isPrimitive, stringifyVar} from "./Var";

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
        return isPrimitive(buf) ? stringifyVar(buf) : toUTF(ByteArray.from(buf));
    }

    public static convert<T extends TypedArrayConstructor>(buf: ByteArraySource, to: T) {
        return ByteArray.from(buf).to(to);
    }

    public to<T extends TypedArrayConstructor>(typedArrayCtor: T) {
        const bytesPerElement = typedArrayCtor.BYTES_PER_ELEMENT;
        const elements = Math.ceil(this.byteLength / bytesPerElement);
        const bufferView = new Uint8Array(bytesPerElement * elements);
        bufferView.set(this, 0);
        return new typedArrayCtor(bufferView.buffer) as Instance<T>;
    }

    public toString(): string {
        return toUTF(this);
    }
}
