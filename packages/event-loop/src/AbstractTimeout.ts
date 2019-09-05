import {Disposer} from "@sirian/disposer";
import {Args, Ctor, Instance} from "@sirian/ts-extra-types";

export type TimeoutCallback = () => any;

export abstract class AbstractTimeout {
    protected started: boolean;
    protected callback: TimeoutCallback;

    protected constructor(callback: TimeoutCallback) {
        this.started = false;
        this.callback = callback;
    }

    public static create<C extends Ctor<AbstractTimeout>>(this: C, ...args: Args<C>) {
        return new this(...args) as Instance<C>;
    }

    public static start<C extends Ctor<AbstractTimeout>>(this: C, ...args: Args<C>) {
        const timeout = new this(...args) as Instance<C>;
        return timeout.start();
    }

    public isStarted() {
        return this.started;
    }

    public start() {
        if (!this.started && !this.isDisposed()) {
            this.started = true;
            this.doStart();
        }

        return this;
    }

    public isDisposed() {
        return Disposer.isDisposed(this);
    }

    public stop(dispose: boolean = false) {
        if (this.started) {
            this.started = false;
            this.doStop();
        }

        if (dispose) {
            Disposer.dispose(this);
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
