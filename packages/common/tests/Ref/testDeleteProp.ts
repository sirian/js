import {deleteProp} from "../../src";

describe("deletePro", () => {
    const data: Array<[any, PropertyKey, boolean]> = [
        [null, 1, false],
        [undefined, 1, false],
        [{}, 1, true],
        ["foo", 1, false],
        ["foo", "length", false],
        ["foo", "x", true],
    ];
    test.each(data)("deleteProp(%p, %p) === %p", (target, key, expected) => {
        expect(deleteProp(target, key)).toBe(expected);
    });

    test("", () => {
        const foo = {x: 1, y: 2};
        expect(deleteProp(foo, "x")).toBe(true);
        expect(foo).toMatchObject({y: 2});
        expect(deleteProp(foo, "z")).toBe(true);
        expect(foo).toMatchObject({y: 2});

        expect(deleteProp(foo, "y")).toBe(true);
        expect(foo).toMatchObject({});
    });
});
