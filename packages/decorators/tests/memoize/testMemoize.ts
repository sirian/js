import {createMemoizer} from "../../src";

describe("", () => {
    const fn = jest.fn(() => 1);

    const memoized = createMemoizer(fn, {});

    test("", () => {
        expect(memoized()).toBe(1);
        expect(memoized()).toBe(1);
        expect(memoized()).toBe(1);

        expect(fn).toBeCalledTimes(1);
    });

    test("", () => {
        const memoized2 = createMemoizer(fn);
        expect(memoized2()).toBe(1);

        expect(fn).toBeCalledTimes(2);
    });
});
