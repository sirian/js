import {AbstractTimeout, MessagePortImmediate, NativeImmediate, TimeoutImmediate} from "@sirian/process";
import {PostMessageImmediate} from "./PostMessageImmediate";

export type ImmediateCallback = () => any;

interface ImmediateDriver {
    set: (fn: ImmediateCallback) => any;
    clear: (id: any) => void;
}

export class Immediate extends AbstractTimeout {
    public static driver?: ImmediateDriver;
    public static readonly active = new Map<any, Immediate>();

    protected id?: any;

    public static clear(handleId: any) {
        this.active.delete(handleId);
        this.getDriver().clear(handleId);
    }

    public static set(callback: () => any) {
        return this.getDriver().set(callback);
    }

    protected static getDriver() {
        if (!this.driver) {
            const drivers = [
                NativeImmediate,
                MessagePortImmediate,
                PostMessageImmediate,
                TimeoutImmediate,
            ] as const;
            const driver = drivers.find((d) => d.supports())!;
            this.driver = new driver();
        }

        return this.driver!;
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
