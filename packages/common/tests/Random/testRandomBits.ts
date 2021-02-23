import {randomBits, randomUint8, range, toInt} from "../../src";

describe("randomUint8", () => {
    const data = range(1, 8);

    test.each(data)("randomBits(%o)", (bits) => {
        const max = 2 ** bits;
        const result = new Uint16Array(max);
        const total = 1000;

        for (let i = 0; i < total; i++) {
            const byte = randomBits(bits);
            expect(byte).toBe(toInt(byte));
            expect(byte).toBeGreaterThanOrEqual(0);
            expect(byte).toBeLessThanOrEqual(max - 1);
            result[byte]++;
        }
        const normal = 1 / max;

        for (let i = 0; i < max; i++) {
            expect(Math.abs(result[i] / total - normal)).toBeLessThan(0.05);
        }
    });
});
