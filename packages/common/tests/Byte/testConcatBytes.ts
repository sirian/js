import {concatBytes, makeArray, randomInt, randomUint8} from "@sirian/common";

describe("concatTypedArrays", () => {
    const generate = (c: number) => {
        const expected: number[] = [];
        const sources = makeArray(c, () => {
            const len = randomInt(0, 5);
            const result = [];
            for (let i = 0; i < len; i++) {
                const value = randomUint8();
                result[i] = value;
                expected.push(value);
            }
            return result;
        });
        return [sources, expected] as const;
    };

    const data = makeArray(5, (i) => generate(i));

    test.each(data)("concatTypedArrays(%O) === %o", (sources, expected) => {
        expect(concatBytes(Uint8Array, ...sources.map((s) => new Uint8Array(s)))).toStrictEqual(new Uint8Array(expected));
    });
});
