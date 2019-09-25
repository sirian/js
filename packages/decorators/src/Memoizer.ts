import {HybridMap, Ref} from "@sirian/common";
import {Args, Func, Return, ThisArg} from "@sirian/ts-extra-types";

export interface IMemoizerOptions<A extends any[]> {
    hasher?: Func<any, A>;
}

export class Memoizer<F extends Func> {
    protected map: HybridMap<any, HybridMap<any, Return<F> | symbol>>;
    protected options: IMemoizerOptions<Args<F>>;
    protected fn: F;
    protected resolving: symbol;

    constructor(fn: F, options?: IMemoizerOptions<Args<F>>) {
        this.map = new HybridMap();
        this.options = {...options};
        this.fn = fn;
        this.resolving = Symbol();
    }

    public static memoize<F extends Func>(fn: F, opts?: IMemoizerOptions<Args<F>>) {
        const memoizer = new Memoizer(fn, opts);

        return new Proxy(fn, {
            apply: (target, thisArg, args) => memoizer.get(thisArg, args),
        });
    }

    public get(thisArg: ThisArg<F>, args: Args<F>) {
        const map = this.map.ensure(thisArg, () => new HybridMap());

        const hashKey = this.getHashKey(thisArg, args);

        if (!map.has(hashKey)) {
            map.set(hashKey, this.resolving);
            map.set(hashKey, Ref.apply(this.fn, thisArg, args));
        }
        const value = map.get(hashKey)!;

        if (value === this.resolving) {
            throw new Error(`Circular @memoize call detected at\n${this.fn}`);
        }

        return value;
    }

    protected getHashKey(thisArg: ThisArg<F>, args: Args<F>) {
        const hasher = this.options.hasher;
        if (hasher) {
            return Ref.apply(hasher, thisArg, args);
        }
    }
}
