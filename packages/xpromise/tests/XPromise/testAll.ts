import {XPromise} from "../../src";

test("Promise.all([]) resolves to []", async () => {
    const p = XPromise.all([]);
    await expect(p).resolves.toStrictEqual([]);
});

test("Promise.all([resolved(x)]) resolves to [x]", async () => {
    const x = {x: 1};
    const p = XPromise.all([XPromise.resolve(x)]);
    await expect(p).resolves.toStrictEqual([x]);
});

test("Promise.all([resolved(x), rejected(y)]) rejects to y", async () => {
    const x = {x: 1};
    const e = new Error("123");
    const p = XPromise.all([XPromise.resolve(x), XPromise.reject(e)]);
    await expect(p).rejects.toStrictEqual(e);
});

test("Promise.all([rejected(x), rejected(y)]) rejects to y", async () => {
    const e1 = {x: 1};
    const e2 = new Error("123");
    const p = XPromise.all([XPromise.reject(e1), XPromise.reject(e2)]);
    await expect(p).rejects.toStrictEqual(e1);
});

test("Promise.all([resolved(x)]) resolves to [x]", async () => {
    const p = XPromise.all([1, 2]);
    await expect(p).resolves.toStrictEqual([1, 2]);
});
