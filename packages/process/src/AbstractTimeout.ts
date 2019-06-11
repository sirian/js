import {Disposer} from "@sirian/disposer";
import {Args, Ctor} from "@sirian/ts-extra-types";

export type TimeoutCallback = () => any;

export abstract class AbstractTimeout {
    protected active: boolean;
    protected ms: number;
    protected callback: TimeoutCallback;

    constructor(ms: number, callback: TimeoutCallback) {
        this.active = false;
        this.ms = ms;
        this.callback = callback;
    }

    public static create<C extends Ctor<AbstractTimeout>>(this: C, ...args: Args<C>) {
        return new this(...args) as InstanceType<C>;
    }

    public static start<C extends Ctor<AbstractTimeout>>(this: C, ...args: Args<C>) {
        const timeout = new this(...args) as InstanceType<C>;
        return timeout.start();
    }

    public isActive() {
        return this.active;
    }

    public start() {
        if (!this.active && !this.isDisposed()) {
            this.active = true;
            this.doStart();
        }

        return this;
    }

    public isDisposed() {
        return Disposer.isDisposed(this);
    }

    public stop(dispose: boolean = false) {
        if (this.active) {
            this.active = false;
            this.doStop();
        }

        if (dispose) {
            Disposer.for(this).dispose();
        }
        return this;
    }

    public restart() {
        return this.stop().start();
    }

    public dispose() {
        this.stop(true);
    }

    protected abstract doStart(): void;

    protected abstract doStop(): void;
}
