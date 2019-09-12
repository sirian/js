import {TaskCallback} from "../AbstractTimeout";
import {ImmediateAdapter} from "../Immediate";

export class TimeoutAdapter implements ImmediateAdapter {
    public static supports() {
        return "function" === typeof setTimeout && "function" === typeof clearTimeout;
    }

    public set(fn: TaskCallback) {
        return setTimeout(fn, 0);
    }

    public clear(id: any) {
        return clearTimeout(id);
    }
}
