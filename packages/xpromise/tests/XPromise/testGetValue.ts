import {XPromise} from "../../src";
import {XPromiseError} from "../../src/XPromiseError";

describe("XPromise.getValue", () => {
    const pendingError = new XPromiseError("Could not get value of pending promise");

    const expectError = (p: XPromise, error) => {
        expect(() => p.getValue()).toThrow(error);
    };

    test("XPromise.resolve(T).getValue() === T", () => {
        expect(XPromise.resolve(3).getValue()).toBe(3);
    });

    test("XPromise.reject(T).getValue() throws T", () => {
        const err = new Error("Custom error");
        expectError(XPromise.reject(err), err);
    });

    test("new XPromise().getValue() throws", () => {
        expectError(new XPromise(), pendingError);
        expectError(XPromise.create(), pendingError);
    });

    test("XPromise.resolve(native promise).getValue() throws", () => {
        expectError(XPromise.resolve(Promise.resolve(1)), pendingError);
        expectError(XPromise.resolve(Promise.reject()), pendingError);
    });

    test("XPromise.resolve(pending promise).getValue() throws", () => {
        expectError(XPromise.resolve(new Promise(() => {})), pendingError);
        expectError(XPromise.resolve(new XPromise()), pendingError);
    });

    test("(await XPromise.resolve(resloved<T>)).getValue() === T", async () => {
        const promise = Promise.resolve(3);
        const p = XPromise.resolve(promise);
        await promise;
        expect(p.getValue()).toBe(3);
    });

    test("(await XPromise.resolve(rejected<T>)).getValue() === T", async () => {
        const error = new Error("Foo");
        const promise = Promise.reject(error);
        const p1 = XPromise.resolve(promise);

        expectError(p1, pendingError);

        await promise.catch(() => void 0);
        expectError(p1, error);

        const p2 = XPromise.resolve(promise);
        const p3 = XPromise.resolve(p1);
        expectError(p2, pendingError);
        expectError(p3, error);

        await promise.catch(() => 3);
        expectError(p2, error);
        expectError(p3, error);
    });
});
