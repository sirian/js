import {Fn} from "../../src";

describe("", () => {
    const data: Array<[string, Record<string, any>, any]> = [
        ["return x", {x: 1}, 1],
        ["return x + y", {x: 1, y: 2}, 3],
        ["\nreturn {x: x}", {x: 1}, {x: 1}],
        ["/**/\nreturn {x: x}", {x: 1}, {x: 1}],
        ["//\nreturn {x: x}", {x: 1}, {x: 1}],
        ["//return {x: x}", {x: 1}, undefined],
        ["return {\nx: x}", {x: 1}, {x: 1}],
        ["return\n{x: x}", {x: 1}, undefined],
    ];

    test.each(data)("Fn.execute(%s, %o)", (code, args, expected) => {
        expect(Fn.execute(code, args)).toEqual(expected);
    });

    test("Test pass by reference", () => {
        const object = {x: 1};

        expect(Fn.execute("return o", {o: object})).toEqual(object);

        Fn.execute("o.x++", {o: object});
        expect(object.x).toEqual(2);
    });
});
