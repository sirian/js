import {jsonParse} from "../../src";

describe("", () => {
    const data: Array<[any, any]> = [
        [undefined, undefined],
        ["undefined", undefined],
        [null, null],
        ["null", null],
        ["", undefined],
        ["1", 1],
        [`"foo"`, "foo"],
        [`{"x":1}`, {x: 1}],
        [`{"x":null}`, {x: null}],
        [`[null]`, [null]],
    ];

    test.each(data)("Json.parse(%o) === %o", (value, expected) => {
        expect(jsonParse(value)).toStrictEqual(expected);
    });
});
