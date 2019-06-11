import {XPromise} from "../../src";

describe("XPromise.getValue", () => {
    const expectError = (p: XPromise) => {
        expect(() => p.getValue()).toThrow(new Error("XPromise is not settled yet"));
    };

    test("XPromise.resolve(T).getValue() === T", () => {
        expect(XPromise.resolve(3).getValue()).toBe(3);
    });

    test("XPromise.reject(T).getValue() === T", () => {
        const err = new Error();
        expect(XPromise.reject(err).getValue()).toBe(err);
    });

    test("new XPromise().getValue() throws", () => {
        expectError(new XPromise());
    });

    test("XPromise.resolve(promise).getValue() throws", () => {
        expectError(XPromise.resolve(Promise.resolve()));
        expectError(XPromise.resolve(Promise.reject()));
    });

    test("(await XPromise.resolve(resloved<T>)).getValue() === T", async () => {
        const promise = Promise.resolve(3);
        const p = XPromise.resolve(promise);
        await promise;
        expect(p.getValue()).toBe(3);
    });

    test("(await XPromise.resolve(rejected<T>)).getValue() === T", async () => {
        const error = new Error();
        const promise = Promise.reject(error);
        const p1 = XPromise.resolve(promise);
        await promise.catch(() => void 0);

        expect(p1.getValue()).toBe(error);
        const p2 = XPromise.resolve(promise);
        expectError(p2);
        await promise.catch(() => void 0);
        expect(p2.getValue()).toBe(error);
    });
});
