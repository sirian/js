import {createMemoizer} from "../../src";

test("", () => {
    const fn: (x: number, y: number) => number = jest.fn((x, y) => x + y);

    const memoized = createMemoizer(fn, {
        hasher: (...args) => args[0],
    });

    expect(memoized(1, 1)).toBe(2);
    expect(fn).toBeCalledTimes(1);

    expect(memoized(1, 2)).toBe(2);
    expect(fn).toBeCalledTimes(1);

    expect(memoized(2, 2)).toBe(4);
    expect(fn).toBeCalledTimes(2);

    expect(memoized(2, 1)).toBe(4);
    expect(fn).toBeCalledTimes(2);
});
