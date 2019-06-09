export function callableClass<T extends object, K extends keyof T>(method: K, ctor: T) {
    return new Proxy(ctor, {
        apply: (target: any, thisArg, args) => {
            return target[method](...args);
        },
    }) as T & T[K];
}
