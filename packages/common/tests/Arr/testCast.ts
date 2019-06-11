
import {Arr} from "../../src";

describe("", () => {
    const data = [1, "", true, false, NaN, {0: 1, length: 1}];

    test.each(data.map((x) => [x, [x]]))("Arr.cast(%o) === %o", (value, expected) => {
        expect(Arr.cast(value)).toEqual(expected);
        expect(Arr.cast([value])).toEqual(expected);
    });

    test("Arr.cast preserve reference", () => {
        const a: any[] = [];
        expect(Arr.cast(a)).toBe(a);

        const b = [a, 1];
        const bCasted = Arr.cast(b);
        expect(bCasted).toBe(b);
        expect(bCasted).toEqual(expect.arrayContaining([a, 1]));
    });
});
