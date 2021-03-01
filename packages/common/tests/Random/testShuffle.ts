import {shuffle} from "../../src";

describe("shuffle", () => {
    test("shuffle", () => {
        const input = [1, 5, 3, 2];

        const tmp = input.map(() => ({}));
        const N = 1000;

        for (let i = 0; i < N; i++) {
            shuffle(input);
            for (let j = 0; j < input.length; j++) {
                const v = input[j];
                tmp[j][v] ??= 0;
                tmp[j][v]++;
            }
        }

        const normal = 1 / input.length;
        for (const x of input) {
            for (let i = 0; i < input.length; i++) {
                expect(Math.abs(tmp[i][x] / N - normal)).toBeLessThan(0.1);
            }
        }
    });
});
