import {coalesce} from "../../src";

describe("Var.coalesce", () => {
    const data: Array<[any[], any]> = [
        [[], undefined],
        [[undefined], undefined],
        [[null], null],
        [[null, undefined], undefined],
        [[undefined, null], null],
        [[undefined, null, undefined], undefined],
        [[undefined, null, undefined], undefined],
        [[undefined, 1, null], 1],
        [[1, 2, 3], 1],
        [[null, 2, 3], 2],
    ];
    test.each(data)("coalesce(...%o) === %o", (args, expected) => {
        expect(coalesce(...args)).toBe(expected);
    });
});
