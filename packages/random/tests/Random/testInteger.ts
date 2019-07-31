import {Random} from "../../src";

describe("Random.integer", () => {
    const errorData: Array<[any, any]> = [
        [0.1, 0.2],
        [-0.2, -0.1],
        [0.1, -0.2],
        [1, 0],
        [-Infinity, 0],
        [0, Infinity],
        [0, 2 ** 53 - 1],
        [0, 2 ** 53],
        [0, 2 ** 53 + 1],
    ];

    test.each(errorData)("Random.integer(%o, %o) throws %o", (min, max, expected = "Invalid integer range") => {
        const r = new Random();
        expect(() => r.integer(min, max)).toThrow(expected);
    });

    test("", () => {
        const r = new Random();
        expect(r.integer(0, 2 ** 53 - 2)).toBeGreaterThanOrEqual(0);
    });
});
