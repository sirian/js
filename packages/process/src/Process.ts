import {Func0} from "@sirian/ts-extra-types";
import {Immediate} from "./Immediate";
import {Timeout} from "./Timeout";

export class Process {
    public static waitTimeout(ms: number) {
        return new Promise((resolve) => Timeout.set(ms, resolve));
    }

    public static waitNextEventLoop() {
        return new Promise((resolve) => Immediate.set(resolve));
    }

    public static async nextTick(callback: Func0) {
        return Promise.resolve().then(callback);
    }
}
