import {global} from "./global";
import {Var} from "./Var";

const ArrayBuffer = global.ArrayBuffer;
const Math = global.Math;
const Uint8Array = global.Uint8Array;

export type ArrBufTarget = ArrayBufferLike | ArrayBufferView;

export class ArrBuf {
    public static isBuffer(value: any): value is ArrayBuffer {
        return Var.isInstanceOf(value, ArrayBuffer);
    }

    public static isView(arg: any): arg is ArrayBufferView {
        return ArrayBuffer.isView(arg);
    }

    public static getBuffer(arg: ArrBufTarget) {
        if (ArrBuf.isBuffer(arg)) {
            return arg;
        }

        if (ArrBuf.isView(arg)) {
            return arg.buffer;
        }

        throw new Error("Expected ArrayBuffer or DataView");
    }

    public static isEqual(t1: ArrBufTarget, t2: ArrBufTarget) {
        const buf1 = ArrBuf.getBuffer(t1);
        const buf2 = ArrBuf.getBuffer(t2);

        if (Var.isEqual(buf1, buf2)) {
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
        const elements = Math.ceil(source.byteLength / bytesPerElement);

        return ArrBuf.transfer(source, elements * bytesPerElement);
    }
}