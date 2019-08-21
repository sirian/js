import {HybridMap, Var} from "@sirian/common";
import {Args, Func, Return, ThisArg} from "@sirian/ts-extra-types";

export interface IDebouncerOptions<A extends any[] = any[]> {
    ms: number | Func<number, A>;
    hasher?: Func<any, A>;
}

export class Debouncer<F extends Func<void>> {
    protected fn: F;
    protected options: IDebouncerOptions<Args<F>>;
    protected timeouts: HybridMap<any, Return<typeof setTimeout>>;

    constructor(fn: F, options?: number | Partial<IDebouncerOptions<Args<F>>>) {
        this.fn = fn;
        this.timeouts = new HybridMap();

        if (Var.isNumber(options)) {
            options = {ms: options};
        }

        this.options = {
            ms: 300,
            ...options,
        };
    }

    public static debounce<F extends Func<void, any>>(fn: F, options?: number | Partial<IDebouncerOptions<Args<F>>>) {
        const debouncer = new Debouncer(fn, options);

        return function(this: ThisArg<F>, ...args: Args<F>) {
            debouncer.apply(this, args);
        } as F;
    }

    protected apply(thisArg: ThisArg<F>, args: Args<F>) {
        const hashKey = this.getHashKey(thisArg, args);
        const timeouts = this.timeouts;

        if (timeouts.has(hashKey)) {
            const oldTimeoutId = timeouts.pick(hashKey);
            clearTimeout(oldTimeoutId);
        }

        const timeoutMs = this.resolveTimeout(thisArg, args);

        const timeoutId = setTimeout(this.fn.bind(thisArg, ...args), timeoutMs);
        timeouts.set(hashKey, timeoutId);
    }

    protected resolveTimeout(thisArg: ThisArg<F>, args: Args<F>) {
        const ms = this.options.ms;

        if (Var.isFunction(ms)) {
            return ms.apply(thisArg, args);
        }

        return ms || 0;
    }

    protected getHashKey(thisArg: ThisArg<F>, args: Args<F>) {
        const hasher = this.options.hasher;
        if (hasher) {
            return hasher.apply(thisArg, args);
        }
    }
}
