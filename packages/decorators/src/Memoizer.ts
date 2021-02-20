import {apply, HybridMap, XSet} from "@sirian/common";
import {Args, Func, Return, ThisArg} from "@sirian/ts-extra-types";
import {DecorateError} from "./DecorateError";

export interface IMemoizerOptions<A extends any[]> {
    hasher?: Func<any, A>;
}

export class Memoizer<F extends Func> {
    protected map = new HybridMap<any, HybridMap<any, Return<F> | symbol>>();
    protected options: IMemoizerOptions<Args<F>>;
    protected fn: F;
    protected resolving = new XSet();

    constructor(fn: F, options?: IMemoizerOptions<Args<F>>) {
        this.options = {...options};
        this.fn = fn;
    }

    public static memoize<F extends Func>(fn: F, opts?: IMemoizerOptions<Args<F>>) {
        const memoizer = new Memoizer(fn, opts);

        return new Proxy(fn, {
            apply: (target, thisArg, args) => memoizer.get(thisArg, args as Args<F>),
        });
    }

    public get(thisArg: ThisArg<F>, args: Args<F>) {
        const map = this.map.ensure(thisArg, () => new HybridMap());
        const resolving = this.resolving;

        const hashKey = this.options.hasher?.(...args);

        if (!map.has(hashKey)) {
            if (!resolving.insert(hashKey)) {
                throw new DecorateError(`Circular @memoize call detected at\n${this.fn}`);
            }
            map.set(hashKey, apply(this.fn, thisArg, args));
            resolving.delete(hashKey);
        }
        return map.get(hashKey)!;
    }

}
