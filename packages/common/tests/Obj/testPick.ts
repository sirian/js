import {Obj} from "../../src";

describe("Obj.pick", () => {
    const foo = {x: 1, y: 2, z: 3};

    const data: Array<[any, any[]]> = [
        [foo, []],
        [foo, ["x"]],
        [foo, ["x", "y"]],
        [foo, ["x", "y", "z"]],
        [foo, ["x", "y", "z"]],
    ];

    test.each(data)("pick(%o, %o)", (obj, keys) => {
        expect(Obj.pick(obj, keys)).toStrictEqual(JSON.parse(JSON.stringify(obj, keys)));
    });
});
