import {XPromise} from "../../src";

describe("XPromise.any", function() {

    test("should handle []", function() {
        expect(XPromise.any([])).rejects.toThrow(new AggregateError([], "All promises were rejected"));
    });

    test("should handle [success, failure]", async () => {
        const promises = [
            Promise.resolve("p1"),
            Promise.reject("p2"),
        ];

        await expect(XPromise.any(promises)).resolves.toBe("p1");
    });

    test("should handle [failure, success]", async () => {
        const promises = [
            Promise.reject("p1"),
            Promise.resolve("p2"),
        ];

        await expect(XPromise.any(promises)).resolves.toBe("p2");
    });

    test("should handle [failure, failure]", async () => {
        const promises = [
            Promise.reject("p1"),
            Promise.reject("p2"),
        ];

        await expect(XPromise.any(promises)).rejects.toThrow(new AggregateError(["p1", "p2"], "All promises were rejected"));
    });

    test("should handle any iterables", async () => {
        const promises = (function*() {
            yield Promise.reject("p1");
            yield Promise.resolve("p2");
        })();

        await expect(XPromise.any(promises)).resolves.toBe("p2");
    });

    test("should handle value that is not a promise", async () => {
        const promises = ["p1"];
        await expect(XPromise.any(promises)).resolves.toBe("p1");
    });

    function delayResolve<T>(ms: number, value?: T) {
        return new Promise<T>((resolve) => setTimeout(() => resolve(value as any), ms));
    }

    function delayReject<T>(ms: number, value?: T) {
        return new Promise<T>((resolve, reject) => setTimeout(() => reject(value), ms));
    }

    test("The first resolving Promise should be acted upon.", async () => {
        const promises: Array<Promise<string>> = [
            delayResolve(20, "yes"),
            delayResolve(50, "nope"),
            delayResolve(65, "nuh-uh"),
        ];

        await expect(XPromise.any(promises)).resolves.toBe("yes");
    });

    test("Rejecting Promises should not effect the acted-upon value so long as some Promise resolves.", async () => {
        const promises = [
            delayReject(5, "ignore me"),
            delayResolve(50, "yes"),
            delayResolve(85, "nuh-uh"),
        ];

        await expect(XPromise.any(promises)).resolves.toBe("yes");
    });

    test("If all Promises reject, XPromise.any should reject.", async () => {
        const promises = [
            delayReject(5, "ignore me"),
            delayReject(50, "yes"),
            delayReject(85, "nuh-uh"),
        ];

        await expect(XPromise.any(promises))
            .rejects.toThrow(new AggregateError(["ignore me", "yes", "nuh-uh"], "All promises were rejected"));
    });

    test("Given some non-Promise items, XPromise.any should return the first of these.", async () => {

        const iterable = [
            delayReject(5, "ignore me"),
            delayResolve(50, "yes"),
            "Hello there!",
            delayResolve(85, "nuh-uh"),
        ];

        await expect(XPromise.any(iterable)).resolves.toBe("Hello there!");
    });
});
