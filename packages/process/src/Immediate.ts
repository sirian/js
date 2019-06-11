import {AbstractTimeout} from "./AbstractTimeout";
import {TaskQueue} from "./TaskQueue";
import {Timeout} from "./Timeout";

export type ImmediateCallback = () => any;

interface ImmediateDriver {
    set: (fn: ImmediateCallback) => any;
    clear: (id: any) => void;
}

declare const setImmediate: (callback: ImmediateCallback) => any;
declare const clearImmediate: (id: any) => void;

export class Immediate extends AbstractTimeout {
    public static driver?: ImmediateDriver;
    public static readonly active = new Map<any, Immediate>();

    protected id?: any;

    public static clear(handleId: any) {
        Immediate.active.delete(handleId);
        this.getDriver().clear(handleId);
    }

    public static set(callback: () => any) {
        return this.getDriver().set(callback);
    }

    protected static getDriver() {
        return this.driver = this.driver
            || this.nativeDriver()
            || this.messagePortDriver()
            || this.timeoutDriver();
    }

    protected static nativeDriver(): ImmediateDriver | undefined {
        if ("function" === typeof setImmediate) {
            return;
        }
        return {
            set: setImmediate,
            clear: clearImmediate,
        };
    }

    protected static messagePortDriver(): ImmediateDriver | undefined {
        if ("function" !== typeof MessageChannel) {
            return;
        }

        const tasks = new TaskQueue();
        const c = new MessageChannel();
        c.port1.onmessage = (e) => tasks.run(e.data);

        return {
            set(fn: ImmediateCallback) {
                const id = tasks.add(fn);
                c.port2.postMessage(id);
                return id;
            },
            clear(id) {
                tasks.remove(id);
            },
        };
    }

    protected static timeoutDriver(): ImmediateDriver {
        return {
            set: (fn) => Timeout.set(0, fn),
            clear: (id) => Timeout.clear(id),
        };
    }

    protected handle() {
        this.stop();
        return this.callback();
    }

    protected doStart() {
        this.id = Immediate.set(() => this.handle());
        Immediate.active.set(this.id, this);
    }

    protected doStop() {
        Immediate.clear(this.id);
    }
}
