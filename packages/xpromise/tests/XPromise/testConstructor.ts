import {XPromise} from "../../src";

test("resolve/reject in constructor with promises", () => {
    const error = new Error();
    const rejected = XPromise.reject(error);
    const value = Symbol();
    const resolved = XPromise.resolve(value);

    const bar1 = new XPromise((resolve) => resolve(rejected));
    void expect(bar1).rejects.toBe(error);

    const bar2 = new XPromise((resolve, reject) => reject(rejected));
    void expect(bar2).rejects.toBe(rejected);

    const bar3 = new XPromise((resolve) => resolve(resolved));
    void expect(bar3).resolves.toBe(value);

    const bar4 = new XPromise((resolve, reject) => reject(resolved));
    void expect(bar4).rejects.toBe(resolved);
});

test("throw in executor", () => {
    const err = {};
    const promise = new XPromise(() => { throw err; });
    expect(promise.isRejected()).toBe(true);
    void expect(promise).rejects.toBe(err);
});
