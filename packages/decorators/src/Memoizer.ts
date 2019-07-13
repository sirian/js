import {HybridMap} from "@sirian/common";
import {Args, Func, Return, ThisArg} from "@sirian/ts-extra-types";

export interface IMemoizerOptions<A extends any[]> {
    hasher?: Func<any, A>;
}

export class Memoizer<F extends Func> {
    protected map: HybridMap<any, HybridMap<any, Return<F>>>;
    protected options: IMemoizerOptions<Args<F>>;
    protected fn: F;

    constructor(fn: F, options?: IMemoizerOptions<Args<F>>) {
        this.map = new HybridMap();
        this.options = {...options};
        this.fn = fn;
    }

    public static memoize<F extends Func>(fn: F, opts?: IMemoizerOptions<Args<F>>) {
        const memoizer = new Memoizer(fn, opts);

        return new Proxy(fn, {
            apply(target, thisArg, args) {
                return memoizer.get(thisArg, args);
            },
        });
    }

    public get(thisArg: ThisArg<F>, args: Args<F>) {
        const map = this.map.ensure(thisArg, () => new HybridMap());

        const hashKey = this.getHashKey(thisArg, args);

        return map.ensure(hashKey, () => this.fn.apply(thisArg, args));
    }

    protected getHashKey(thisArg: ThisArg<F>, args: Args<F>) {
        const hasher = this.options.hasher;
        if (hasher) {
            return hasher.apply(thisArg, args);
        }
    }
}
