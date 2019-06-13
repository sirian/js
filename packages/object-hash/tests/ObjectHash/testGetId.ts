import {ObjectHash} from "../../src";

describe("", () => {
    const data: Array<[any, string]> = [
        [true, "true"],
        [false, "false"],
        [null, "null"],
        [undefined, "undefined"],
        [42, "number:42"],
        ["", "string:"],
        ["foo", "string:foo"],
        [Symbol.iterator, "symbol=Symbol.iterator"],
        [Symbol.asyncIterator, "symbol=Symbol.asyncIterator"],
        [Symbol.for("test"), "symbol:test"],
        [Symbol.for("Symbol.iterator"), "symbol:Symbol.iterator"],
        [Symbol.for(""), "symbol:"],
        [Symbol(), "symbol#1"],
        [Symbol(), "symbol#2"],
        [{}, "object#3"],
    ];

    test.each(data)("ObjectHash.getId(%O) === %O", (value, expected) => {
        expect(ObjectHash.getId(value)).toBe(expected);
    });
});
