import {abs, isInt, toBigInt} from "@sirian/common";

describe("abs", () => {
    const data: Array<[number, number]> = [
        -1.5, -1, -0, 0, 1, 1.5, NaN, 1 / 0, -1 / 0,
    ].map((v) => [v, Math.abs(v)]);

    test.each(data)("abs(%p) === %p", (value, expected) => {
        expect(abs(value)).toBe(expected);

        if (isInt(value)) {
            const big = toBigInt(value);
            expect(abs(big)).toBe(toBigInt(expected));
        }
    });
});
