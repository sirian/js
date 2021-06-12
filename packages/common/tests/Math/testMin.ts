import {min, shuffle, toBigInt} from "@sirian/common";

describe("min", () => {
    const data: Array<[number, number[]]> = [
        [1, [1]],
        [1, [1, 2, 3]],
        [-2, [-1, -2]],
    ];

    test.each(data)("%o === min(...%o)", (expected, values) => {
        const bigInt = values.map(toBigInt);

        expect(min(...values)).toBe(expected);
        expect(min(...bigInt)).toBe(toBigInt(expected));

        expect(min(...shuffle(values))).toBe(expected);
        expect(min(...shuffle(bigInt))).toBe(toBigInt(expected));
    });
});
