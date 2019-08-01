import {Random} from "../../src";

describe("Random.integer", () => {
    const errorData: Array<[any, any]> = [
        [0.1, 0.2],
        [-0.2, -0.1],
        [0.1, -0.2],
        [1, 0],
        [-Infinity, 0],
        [0, Infinity],
    ];

    test.each(errorData)("Random.integer(%o, %o) throws %o", (min, max, expected = "Invalid range") => {
        const r = new Random();
        expect(() => r.int(min, max)).toThrow(expected);
    });

    test("", () => {
        const r = new Random();
        for (let i = 0; i < 100; i++) {
            expect(r.int(2 ** 53, 2 ** 53 + 1)).toBe(2 ** 53);
        }
    });
});
