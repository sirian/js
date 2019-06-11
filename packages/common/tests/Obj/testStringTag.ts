import {Obj} from "../../src";

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
        [() => 1, "Function"],
        ["foo", "String"],
        [3, "Number"],
        [true, "Boolean"],
        [Symbol.iterator, "Symbol"],
        [Foo, "Function"],
        [new Foo(), "Bar"],
    ];

    test.each(data)("Obj.getStringTag(%o) === %o", (obj, tag) => {
        expect(Obj.getStringTag(obj)).toBe(tag);
    });
});
