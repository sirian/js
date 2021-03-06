import {isEqualNaN, randomInt} from "@sirian/common";

describe("randomInt", () => {
    const generate = (min: number, max: number, inclusive: boolean) => {
        const v = randomInt(min, max, inclusive);
        if (isEqualNaN(v) || v < min) {
            expect(v).toBeGreaterThanOrEqual(min);
        }
        if (inclusive && v > max) {
            expect(v).toBeLessThanOrEqual(max);
        }
        if (!inclusive && v >= max) {
            expect(v).toBeLessThan(max);
        }
        return v;
    };
    test("randomInt(0, 0)", () => {
        expect(() => generate(0, 0, false)).toThrow("Invalid range");
        expect(() => generate(1, 0, false)).toThrow("Invalid range");
        expect(() => generate(2, 0, false)).toThrow("Invalid range");
        expect(() => generate(2, 1, false)).toThrow("Invalid range");
        expect(() => generate(2, 2, false)).toThrow("Invalid range");
        for (let i = 0; i < 100; i++) {
            expect(generate(0, 0, true)).toBe(0);
            expect(generate(0, 1, false)).toBe(0);
        }
    });
    test("randomInt(0, 0)", () => {
        for (let i = 0; i < 100; i++) {
            const v = generate(0, 1, false);
            expect(v).toBe(0);
        }
    });

    test("randomInt(3, 7, true)", () => {
        const randoms: Record<number, number> = {};
        const total = 1000;
        const min = 3;
        const max = 7;
        for (let i = 0; i < total; i++) {
            const v = generate(min, max, true);
            randoms[v] ??= 0;
            randoms[v]++;
        }
        const normal = 1 / (max - min + 1);

        for (let i = min; i <= max; i++) {
            expect(Math.abs(randoms[i] / total - normal)).toBeLessThan(0.05);
        }
    });

    test("randomInt(3, 7, false)", () => {
        const randoms: Record<number, number> = {};
        const total = 1000;
        const min = 3;
        const max = 7;
        for (let i = 0; i < total; i++) {
            const v = generate(min, max, false);
            randoms[v] ??= 0;
            randoms[v]++;
        }

        const normal = 1 / (max - min);

        for (let i = min; i < max; i++) {
            expect(Math.abs(randoms[i] / total - normal)).toBeLessThan(0.05);
        }
    });
});
