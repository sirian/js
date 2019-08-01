import {Func0} from "@sirian/ts-extra-types";

export class EventLoop {
    // public static waitTimeout(ms: number) {
    //     return new Promise((resolve) => Timeout.set(ms, resolve));
    // }

    // public static waitNextEventLoop() {
    //     return new Promise((resolve) => Immediate.set(resolve));
    // }

    public static async nextTick(callback: Func0) {
        await void 0;
        return callback();
    }
}
