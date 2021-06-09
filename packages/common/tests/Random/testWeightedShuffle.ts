import {weightedShuffle} from "../../src";

describe("weightedShuffle([2, 3, 5])", () => {
    test("", () => {
        const input = [2, 3, 5];

        const tmp: Record<number, number> = {};
        const N = 1000;

        for (let i = 0; i < N; i++) {
            const b = weightedShuffle(input, (x) => x);
            const v = b[0];
            tmp[v] ??= 0;
            tmp[v]++;
        }

        const sum = input.reduce((x, y) => x + y);

        for (const x of input) {
            expect(Math.abs(tmp[x] / N - x / sum)).toBeLessThan(0.05);
        }
    });

    test("weightedShuffle([])", () => {
        const a: [] = [];
        const b = weightedShuffle(a, () => 1);
        expect(b).toBe(a);
        expect(a).toStrictEqual([]);
    });

    test("weightedShuffle([1])", () => {
        const a = ["foo"];
        const b = weightedShuffle(a, () => 1);
        expect(b).toBe(a);
        expect(a).toStrictEqual(["foo"]);
    });
});
