import {Memoizer} from "../../src";

describe("", () => {
    const fn = jest.fn(() => 1);

    const memoized = Memoizer.memoize(fn, {});

    test("", () => {
        expect(memoized()).toBe(1);
        expect(memoized()).toBe(1);
        expect(memoized()).toBe(1);

        expect(fn).toBeCalledTimes(1);
    });

    test("", () => {
        const memoized2 = Memoizer.memoize(fn);
        expect(memoized2()).toBe(1);

        expect(fn).toBeCalledTimes(2);
    });
});
