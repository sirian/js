import {ImmediateCallback} from "@sirian/process";

export class TimeoutImmediate {
    public static supports() {
        return true;
    }

    public set(fn: ImmediateCallback) {
        return setTimeout(fn, 0);
    }

    public clear(id: ReturnType<typeof setTimeout>) {
        return clearTimeout(id);
    }
}
