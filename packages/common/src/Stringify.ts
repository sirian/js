function helper<T extends { toString: () => string }>(ctor: { prototype: T }) {
    const toString = ctor.prototype.toString;
    return (v: T) => toString.call(v);
}

export const stringifyObj = helper(Object);
export const stringifyFn = helper(Function);
