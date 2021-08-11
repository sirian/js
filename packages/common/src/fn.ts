import {Args, Func, Get, Negate, Return, Splice} from "@sirian/ts-extra-types";

export const not = <F extends Func>(fn: F) => function(this: any, ...args) {
    return !fn.apply(this, args);
} as Negate<F>;

// export const firstArg = <T extends any[]>(...args: T) => args[0] as Head<T>;

export const callableClass = <T extends object, K extends keyof T>(method: K, ctor: T): T & T[K] => new Proxy(ctor, {
    apply: (target: any, thisArg, args) => target[method](...args),
}) as T & T[K];

export const bindArgs = function <K extends number, F extends Func>(fn: F, bind: { [P in K]: Get<Args<F>, P> }): Func<Return<F>, Splice<Args<F>, K>> {
    return function(this: any, ...args: Splice<Args<F>, K>) {
        const mergedArgs: unknown[] = Object.assign([], bind);

        for (let i = 0; args.length > 0; i++) {
            if (i in mergedArgs) {
                continue;
            }

            mergedArgs[i] = args.shift();
        }

        return fn.apply(this, mergedArgs as Args<F>) as Return<F>;
    };
};
