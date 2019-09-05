import {Property} from "../../src";

describe("Property.modify", () => {
    const data: Array<[any, string, (v: any) => any, any]> = [
        [{}, "x", (v = 0) => v + 1, {x: 1}],
        [{x: 1}, "x", (v = 0) => v + 1, {x: 2}],
        [{}, "x.y", (v = 0) => v + 1, {x: {y: 1}}],
        [{x: 1}, "y", () => 2, {x: 1, y: 2}],
        [{x: 1, y: {}}, "y", () => 3, {x: 1, y: 3}],
    ];
    test.each(data)("Property.modify(%o, %o, %s) === %o", (o, path, fn, expected) => {
        Property.modify(o, path, fn);
        expect(o).toStrictEqual(expected);
    });
});
