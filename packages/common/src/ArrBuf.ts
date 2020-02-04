import {Unicode} from "./Unicode";
import {isEqual, isFunction, isInstanceOf, isNumber, isObject, isPrimitive} from "./Var";

export type ArrBufTarget = ArrayBufferLike | ArrayBufferView | string;

export class ArrBuf {
    public static isBuffer(value: any): value is ArrayBuffer {
        return isInstanceOf(value, ArrayBuffer);
    }

    public static isView(arg: any): arg is ArrayBufferView {
        return ArrayBuffer.isView(arg);
    }

    public static getBuffer(arg: ArrBufTarget) {
        if (isPrimitive(arg)) {
            return Unicode.stringToBytes(arg).buffer;
        }

        if (ArrBuf.isBuffer(arg)) {
            return arg;
        }

        if (ArrBuf.isView(arg)) {
            const buffer = arg.buffer;
            const offset = arg.byteOffset;
            const byteLength = arg.byteLength;
            return buffer.slice(offset, offset + byteLength);
        }

        throw new Error("Expected ArrayBuffer or DataView");
    }

    public static isBufferLike(arg: any): arg is ArrayBufferLike {
        return isObject(arg) && isNumber(arg.byteLength) && isFunction(arg.slice);
    }

    public static isEqual(t1: ArrBufTarget, t2: ArrBufTarget) {
        const buf1 = ArrBuf.getBuffer(t1);
        const buf2 = ArrBuf.getBuffer(t2);

        if (isEqual(buf1, buf2)) {
            return true;
        }

        if (buf1.byteLength !== buf2.byteLength) {
            return false;
        }

        const view1 = new DataView(buf1);
        const view2 = new DataView(buf2);

        for (let i = buf1.byteLength - 1; i >= 0; i--) {
            if (view1.getUint8(i) !== view2.getUint8(i)) {
                return false;
            }
        }

        return true;
    }

    public static set(from: ArrBufTarget, to: ArrBufTarget, offset: number = 0) {
        const sourceView = new Uint8Array(ArrBuf.getBuffer(from));
        const destView = new Uint8Array(ArrBuf.getBuffer(to));
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
