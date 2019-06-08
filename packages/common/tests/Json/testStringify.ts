import {Json} from "../../src";

describe("", () => {
    const data: Array<[any, string]> = [
        [undefined, "null"],
        [null, "null"],
        [1, "1"],
        ["foo", `"foo"`],
        [{x: 1}, `{"x":1}`],
        [{x: undefined}, `{}`],
        [{x: null}, `{"x":null}`],
        [[null], `[null]`],
        [[undefined], `[null]`],
    ];

    test.each(data)("Json.stringify(%o) === %o", (value, expected) => {
        expect(Json.stringify(value)).toBe(expected);
    });
});
