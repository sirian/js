import {ByteArray} from "./ByteArray";
import {Unicode} from "./Unicode";
import {isArrayBuffer, isArrayBufferView, isEqual, isString} from "./Var";

export type ArrBufTarget = ArrayBuffer | ArrayBufferView | string;

export class ArrBuf {
    public static getBuffer(arg: ArrBufTarget) {
        if (isString(arg)) {
            return Unicode.stringToBytes(arg).buffer;
        }

        if (isArrayBuffer(arg)) {
            return arg;
        }

        if (isArrayBufferView(arg)) {
            const buffer = arg.buffer;
            const offset = arg.byteOffset;
            const byteLength = arg.byteLength;
            return buffer.slice(offset, offset + byteLength);
        }

        throw new Error("Expected ArrayBuffer or DataView");
    }

    public static isEqual(t1: ArrBufTarget, t2: ArrBufTarget) {
        if (t1 === t2) {
            return true;
        }

        const buf1 = ArrBuf.getBuffer(t1);
        const buf2 = ArrBuf.getBuffer(t2);

        if (isEqual(buf1, buf2)) {
            return true;
        }

        if (buf1.byteLength !== buf2.byteLength) {
            return false;
        }

        const view1 = new ByteArray(buf1);
        const view2 = new ByteArray(buf2);
        return view1.every((value, index) => value === view2[index]);
    }

    public static set(from: ArrBufTarget, to: ArrBufTarget, offset: number = 0) {
        const sourceView = new ByteArray(ArrBuf.getBuffer(from));
        const destView = new ByteArray(ArrBuf.getBuffer(to));
        destView.set(sourceView, offset);
    }

    public static transfer(source: ArrBufTarget, length: number) {
        let buf = ArrBuf.getBuffer(source);

        if (length < buf.byteLength) {
            buf = buf.slice(0, length);
        }

        const dest = new ArrayBuffer(length);

        ArrBuf.set(buf, dest);

        return dest;
    }

    public static align(source: ArrBufTarget, bytesPerElement: number) {
        const buffer = ArrBuf.getBuffer(source);

        const elements = Math.ceil(buffer.byteLength / bytesPerElement);

        return ArrBuf.transfer(source, elements * bytesPerElement);
    }
}
