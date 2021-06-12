import {max, shuffle, toBigInt} from "@sirian/common";

describe("max", () => {
    const data: Array<[number, number[]]> = [
        [1, [1]],
        [3, [1, 2, 3]],
        [-1, [-1, -2]],
    ];

    test.each(data)("%o === max(...%o)", (expected, values) => {
        const bigInt = values.map(toBigInt);

        expect(max(...values)).toBe(expected);
        expect(max(...bigInt)).toBe(toBigInt(expected));

        expect(max(...shuffle(values))).toBe(expected);
        expect(max(...shuffle(bigInt))).toBe(toBigInt(expected));
    });
});
