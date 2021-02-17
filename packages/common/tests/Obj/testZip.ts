import {objZip} from "../../src";

describe("Obj.zip", () => {
    const data: Array<[any[], any[], object]> = [
        [[], [], {}],
        [["x"], [], {x: undefined}],
        [["x"], [1], {x: 1}],
        [["x"], [1, 2], {x: 1}],
        [["x"], [1, 2], {x: 1}],
        [["x", "y"], [1, 2], {x: 1, y: 2}],
    ];

    test.each(data)("Obj.zip(%o) === %o", (keys, values, expected) => {
        expect(objZip(keys, values)).toStrictEqual(expected);
    });
});
