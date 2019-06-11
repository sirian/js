import {Deferred, XPromise} from "../../src";

test("Finally return value ignored", async () => {
    const promise = new Deferred();
    promise.resolve(123);

    await expect(promise).resolves.toBe(123);

    await expect(promise.finally()).resolves.toBe(123);
    await expect(promise.finally(() => 456)).resolves.toBe(123);
    await expect(promise.finally(() => Promise.resolve(456))).resolves.toBe(123);
    await expect(promise.finally(() => XPromise.resolve(456))).resolves.toBe(123);

    const fn = jest.fn();

    await promise.finally(fn);
    expect(fn).toHaveBeenCalledWith();
});

test("Test throw finally", async () => {
    const err1 = new Error("123");

    const promise = new Deferred();
    promise.reject(err1);

    await expect(promise).rejects.toThrow(err1);

    const err2 = new Error("456");

    await expect(promise.finally(() => { throw err2; })).rejects.toThrow(err2);
    await expect(promise.finally(() => Promise.reject(err2))).rejects.toThrow(err2);
    await expect(promise.finally(() => XPromise.reject(err2))).rejects.toThrow(err2);
});

test("Test resolver in finally preserve error", async () => {
    const err1 = new Error("123");

    const promise = new Deferred();
    promise.reject(err1);

    await expect(promise).rejects.toThrow(err1);
    await expect(promise.finally(() => 789)).rejects.toThrow(err1);
    await expect(promise.finally(() => Promise.resolve(789))).rejects.toThrow(err1);
    await expect(promise.finally(() => XPromise.resolve(789))).rejects.toThrow(err1);
});

test("Test non function finally", async () => {
    const promise = new Deferred();
    promise.resolve(1);

    const values: any[] = [
        undefined, null, {}, true, new Error(),
    ];

    await expect(promise).resolves.toBe(1);
    await expect(promise.finally()).resolves.toBe(1);

    for (const value of values) {
        await expect(promise.finally(value)).resolves.toBe(1);
    }
});
