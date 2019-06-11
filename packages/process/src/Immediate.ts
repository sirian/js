import {Func0} from "@sirian/ts-extra-types";
import {TaskQueue} from "./TaskQueue";
import {Timeout} from "./Timeout";

declare const setImmediate: (callback: Func0) => any;

export class Immediate {
    public static driver = Immediate.nativeDriver()
        || Immediate.messagePortDriver()
        || Immediate.setTimeoutDriver();

    public static set(callback: () => any) {
        if ("function" === typeof setImmediate) {
            this.driver(callback);
        } else {
            Timeout.set(0, callback);
        }
    }

    protected static messagePortDriver() {
        if ("undefined" === typeof MessageChannel) {
            return;
        }

        const c = new MessageChannel();
        const queue = new TaskQueue();
        c.port1.onmessage = (e) => queue.run(e.data);
        return (fn: Func0) => c.port2.postMessage(queue.add(fn));
    }

    protected static nativeDriver() {
        if ("undefined" === typeof setImmediate) {
            return;
        }
        return setImmediate;
    }

    protected static setTimeoutDriver() {
        return (fn: Func0) => Timeout.set(0, fn);
    }
}
