import {getObjectTag} from "../../src";

describe("", () => {
    class Foo {
        get [Symbol.toStringTag]() {
            return "Bar";
        }
    }

    const data: Array<[any, string]> = [
        [new Date(), "Date"],
        [{}, "Object"],
        [[], "Array"],
        [/./, "RegExp"],
        [() => 1, "Function"],
        ["foo", "String"],
        [3, "Number"],
        [null, "Null"],
        [undefined, "Undefined"],
        [true, "Boolean"],
        [Symbol.iterator, "Symbol"],
        [Foo, "Function"],
        [new Foo(), "Bar"],
    ];

    test.each(data)("getObjectTag(%o) === %o", (obj, tag) => {
        expect(getObjectTag(obj)).toBe(tag);
    });
});
