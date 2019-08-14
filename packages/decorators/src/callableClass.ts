export function callableClass<T extends object, K extends keyof T>(method: K, ctor: T): T & T[K] {
    return new Proxy(ctor, {
        apply: (target: any, thisArg, args) => target[method](...args),
    }) as T & T[K];
}
