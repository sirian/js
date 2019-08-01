import {ImmediateAdapter, ImmediateCallback} from "./Immediate";

declare const setImmediate: (callback: ImmediateCallback) => any;
declare const clearImmediate: (id: any) => void;

export class NativeImmediateAdapter implements ImmediateAdapter {
    public static supports() {
        return "function" === typeof setImmediate;
    }

    public set(fn: ImmediateCallback) {
        return setImmediate(fn);
    }

    public clear(id: any) {
        clearImmediate(id);
    }
}
