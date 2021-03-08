import {memoized} from "../../src";

test("", () => {
    const fn: (x: number, y: number) => number = jest.fn((x, y) => x + y);

    const fn2 = memoized(fn, {
        hasher: (thisArg, x) => x,
    });

    expect(fn2(1, 1)).toBe(2);
    expect(fn).toBeCalledTimes(1);

    expect(fn2(1, 2)).toBe(2);
    expect(fn).toBeCalledTimes(1);

    expect(fn2(2, 2)).toBe(4);
    expect(fn).toBeCalledTimes(2);

    expect(fn2(2, 1)).toBe(4);
    expect(fn).toBeCalledTimes(2);
});
