import {TaskCallback} from "../AbstractTimeout";
import {ImmediateAdapter} from "../Immediate";

declare const setImmediate: (callback: TaskCallback) => any;
declare const clearImmediate: (id: any) => void;

export class NativeImmediateAdapter implements ImmediateAdapter {
    public static supports() {
        return "function" === typeof setImmediate && "function" === typeof clearImmediate;
    }

    public set(fn: TaskCallback) {
        return setImmediate(fn);
    }

    public clear(id: any) {
        clearImmediate(id);
    }
}
