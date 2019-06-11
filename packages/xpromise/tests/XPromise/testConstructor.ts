import {XPromise} from "../../src";

test("resolve/reject in constructor with promises", async () => {
    const error = new Error();
    const rejected = XPromise.reject(error);
    const value = Symbol();
    const resolved = XPromise.resolve(value);

    const bar1 = new XPromise((resolve, reject) => resolve(rejected));
    await expect(bar1).rejects.toBe(error);

    const bar2 = new XPromise((resolve, reject) => reject(rejected));
    await expect(bar2).rejects.toBe(rejected);

    const bar3 = new XPromise((resolve, reject) => resolve(resolved));
    await expect(bar3).resolves.toBe(value);

    const bar4 = new XPromise((resolve, reject) => reject(resolved));
    await expect(bar4).rejects.toBe(resolved);
});
