import {pick} from "../../src";

describe("pick", () => {
    const foo = {x: 1, y: 2, z: 3};

    const data: Array<[any, any[]]> = [
        [foo, []],
        [foo, ["x"]],
        [foo, ["x", "y"]],
        [foo, ["x", "y", "z"]],
        [foo, ["x", "y", "z"]],
        [foo, ["x", "y", "z", "foo"]],
    ];

    test.each(data)("pick(%o, %o)", (obj, keys) => {
        expect(pick(obj, keys)).toStrictEqual(JSON.parse(JSON.stringify(obj, keys)));
    });

    test("", () => {
        expect(pick([1, 2], ["length" as const])).toStrictEqual({length: 2});
    });
});
