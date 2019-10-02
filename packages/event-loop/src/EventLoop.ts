import {Immediate} from "./Immediate";
import {Interval} from "./Interval";
import {NextTick} from "./NextTick";
import {TaskCallback} from "./TaskQueue";
import {Timeout} from "./Timeout";

export class EventLoop {
    public static waitTimeout(ms: number) {
        return new Promise((resolve) => EventLoop.setTimeout(ms, resolve));
    }

    // public static waitNextEventLoop() {
    //     return new Promise((resolve) => Immediate.set(resolve));
    // }

    public static nextTick(callback: TaskCallback) {
        return NextTick.start(callback);
    }

    public static setImmediate(callback: TaskCallback) {
        return Immediate.start(callback);
    }

    public static setTimeout(ms: number, callback: TaskCallback) {
        return Timeout.start(ms, callback);
    }

    public static setInterval(ms: number, callback: TaskCallback) {
        return Interval.start(ms, callback);
    }
}
