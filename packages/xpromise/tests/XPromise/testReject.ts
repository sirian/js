import {XPromise} from "../../src";

test(".then(nonFunction)", async () => {
    const then1 = XPromise.resolve(2).then(1 as any);
    await expect(then1).resolves.toBe(2);
});

test(".then(any, nonFunction)", async () => {
    const then1 = XPromise.reject(2).then(-1 as any, 1 as any);
    await expect(then1).rejects.toBe(2);
});

test("XPromise.reject(2)", async () => {
    const then1 = XPromise.reject(2);
    await expect(then1).rejects.toBe(2);
});

test("XPromise.resolve(XPromise.create())", async () => {
    const p2 = XPromise.create();
    const p = XPromise.resolve(p2);
    await expect(p).toBe(p2);
});

test(".then(any, throwsFn)", async () => {
    const e = new Error("123");

    const then1 = XPromise.reject(2).catch(() => {
        throw e;
    });

    expect(then1.isRejected()).toBe(true);

    await expect(then1).rejects.toBe(e);
});

test("XPromise.resolve(then getter throws)", async () => {
    const then1 = Object.create(null, {
        then: {
            get: () => {
                throw 123;
            },
        },
    });
    await expect(XPromise.resolve().then(() => then1)).rejects.toBe(123);
});
