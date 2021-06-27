import {abs} from "@sirian/common";

describe("abs", () => {
    const data = [
        [-1.5, 1.5],
        [-1, 1],
        [-0, 0],
        [0, 0],
        [1, 1],
        [1.5, 1.5],
        [NaN, NaN],
        [1 / 0, 1 / 0],
        [-1 / 0, 1 / 0],
        [-10n, 10n],
        [-0n, 0n],
        [0n, 0n],
        [10n, 10n],
    ] as const;

    test.each(data)("abs(%p) === %p", (value, expected) => {
        expect(Object.is(abs(value), expected)).toBe(true);
    });
});
