import {apply, isFunction, isNumber, XMap} from "@sirian/common";
import {Func} from "@sirian/ts-extra-types";

export interface IDebouncerOptions<A extends any[]> {
    ms?: number | Func<number, [any, A]>;
    hasher?: Func<any, [any, A]>;
}

export class Debouncer<A extends any[]> {
    protected fn: (...args: A) => any;
    protected ms: IDebouncerOptions<A>["ms"];
    protected hasher?: IDebouncerOptions<A>["hasher"];
    protected hashMap: XMap<any, [any, A]>;

    constructor(fn: (...args: A) => any, options: number | IDebouncerOptions<A> = {}) {
        this.fn = fn;
        this.hashMap = new XMap();

        if (isNumber(options)) {
            this.ms = options;
        } else {
            const {ms = 300, hasher} = options;
            this.ms = ms;
            this.hasher = hasher;
        }
    }

    public static debounce<A extends any[]>(fn: (...args: A) => any, options?: number | IDebouncerOptions<A>) {
        const debouncer = new Debouncer(fn, options);

        return new Proxy(fn, {
            apply: (target, thisArg, args) => debouncer.apply(thisArg, args as A),
        });
    }

    protected apply(thisArg: any, args: A) {
        const hashKey = this.getHashKey(thisArg, args);
        const hashMap = this.hashMap;

        if (!hashMap.has(hashKey)) {
            const timeoutMs = this.resolveTimeout(thisArg, args);
            setTimeout(() => this.resolve(hashKey), timeoutMs);
        }

        hashMap.set(hashKey, [thisArg, args]);
    }

    protected resolve(hashKey: string) {
        const [thisArg, args] = this.hashMap.pick(hashKey, true);
        apply(this.fn, thisArg, args);
    }

    protected resolveTimeout(thisArg: any, args: A) {
        const ms = this.ms;

        if (isFunction(ms)) {
            return ms(thisArg, args);
        }

        return ms || 0;
    }

    protected getHashKey(thisArg: any, args: A) {
        const hasher = this.hasher;
        return hasher ? hasher(thisArg, args) : thisArg;
    }
}
