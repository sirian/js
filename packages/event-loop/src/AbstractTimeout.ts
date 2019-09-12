import {Args, Ctor, Instance} from "@sirian/ts-extra-types";

export type TaskCallback = () => any;

export abstract class AbstractTimeout {
    protected callback?: TaskCallback;

    protected constructor(callback?: TaskCallback) {
        this.callback = callback;
    }

    public static create<C extends Ctor<AbstractTimeout>>(this: C, ...args: Args<C>) {
        return new this(...args) as Instance<C>;
    }

    public static start<C extends Ctor<AbstractTimeout>>(this: C, ...args: Args<C>) {
        const timeout = new this(...args) as Instance<C>;
        return timeout.start();
    }

    public abstract isActive(): boolean;

    public abstract start(): this;

    public abstract clear(): this;

    public restart() {
        return this.clear().start();
    }

    public setCallback(callback?: TaskCallback) {
        this.callback = callback;
        if (!callback) {
            this.clear();
        }
    }

    protected handle() {
        return this.callback && this.callback();
    }
}
