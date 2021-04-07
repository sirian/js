import {XPromise} from "../../src";

describe("XPromise.race", function() {

    test("should handle []", function() {
        const p = XPromise.race([]);
        expect(p.isPending()).toBe(true);
        expect(p.isSettled()).toBe(false);
    });

    test("should handle [success, failure]", async () => {
        const promises = [
            Promise.resolve("p1"),
            Promise.reject("p2"),
        ];

        await expect(XPromise.race(promises)).resolves.toBe("p1");
    });

    test("should handle [failure, success]", async () => {
        const promises = [
            Promise.reject(new Error("p1")),
            Promise.resolve("p2"),
        ];

        await expect(XPromise.race(promises)).rejects.toThrow("p1");
    });

    test("should handle [failure, failure]", async () => {
        const promises = [
            Promise.reject(new Error("p1")),
            Promise.reject("p2"),
        ];

        await expect(XPromise.race(promises)).rejects.toThrow("p1");
    });

    test("should handle value that is not a promise", async () => {
        const promises = ["p1"];
        await expect(XPromise.race(promises)).resolves.toBe("p1");
    });

    function delayResolve<T>(ms: number, value?: T) {
        return new Promise<T>((resolve) => setTimeout(() => resolve(value), ms));
    }

    function delayReject<T>(ms: number, value?: T) {
        return new Promise<T>((resolve, reject) => setTimeout(() => reject(new Error(value)), ms));
    }

    test("The first resolving Promise should be acted upon.", async () => {
        const promises: Array<Promise<string>> = [
            delayResolve(20, "yes"),
            delayResolve(50, "nope"),
            delayResolve(65, "nuh-uh"),
        ];

        await expect(XPromise.race(promises)).resolves.toBe("yes");
    });

    test("Rejecting Promises should effect", async () => {
        const promises = [
            delayReject(5, "ignore me"),
            delayResolve(50, "yes"),
            delayResolve(85, "nuh-uh"),
        ];

        await expect(() => XPromise.race(promises)).rejects.toThrow("ignore me");
    });

    test("Given some non-Promise items, XPromise.race should return the first of these.", async () => {

        const iterable = [
            delayReject(5, "ignore me"),
            delayResolve(50, "yes"),
            "Hello there!",
            delayResolve(85, "nuh-uh"),
        ];

        await expect(XPromise.race(iterable)).resolves.toBe("Hello there!");
    });
});
