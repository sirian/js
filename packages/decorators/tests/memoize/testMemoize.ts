import {memoized} from "../../src";

describe("", () => {
    const fn = jest.fn(() => 1);

    const fn2 = memoized(fn, {});

    test("", () => {
        expect(fn2()).toBe(1);
        expect(fn2()).toBe(1);
        expect(fn2()).toBe(1);

        expect(fn).toBeCalledTimes(1);
    });

    test("", () => {
        const memoized2 = memoized(fn);
        expect(memoized2()).toBe(1);

        expect(fn).toBeCalledTimes(2);

        expect(memoized2()).toBe(1);
        expect(fn).toBeCalledTimes(2);
    });
});
