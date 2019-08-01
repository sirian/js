import {
    AbstractTimeout,
    MessagePortImmediateAdapter,
    NativeImmediateAdapter,
    PostMessageImmediateAdapter,
    TimeoutImmediate,
} from "../";

export type ImmediateCallback = () => void;

export interface ImmediateAdapter<T = unknown> {
    set: (fn: ImmediateCallback) => T;
    clear: (id: T) => void;
}

export class Immediate<T = unknown> extends AbstractTimeout {
    public static adapter?: ImmediateAdapter<any>;

    protected id?: T;
    protected adapter: ImmediateAdapter<T>;

    constructor(callback: ImmediateCallback, driver?: ImmediateAdapter<T>) {
        super(callback);
        this.adapter = driver || Immediate.getAdapter();
    }

    public static clear(handleId: any) {
        this.getAdapter().clear(handleId);
    }

    public static set(callback: () => any) {
        return this.getAdapter().set(callback);
    }

    protected static getAdapter() {
        if (!this.adapter) {
            const drivers = [
                NativeImmediateAdapter,
                MessagePortImmediateAdapter,
                PostMessageImmediateAdapter,
                TimeoutImmediate,
            ] as const;
            const driver = drivers.find((d) => d.supports())!;
            this.adapter = new driver();
        }

        return this.adapter!;
    }

    protected handle() {
        this.stop();
        return this.callback();
    }

    protected doStart() {
        this.id = this.adapter.set(() => this.handle());
    }

    protected doStop() {
        this.adapter.clear(this.id!);
    }
}
