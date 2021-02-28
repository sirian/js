import {objMap} from "../../src";

describe("objMap", () => {
    test("objMap", () => {
        expect(objMap([1, 2, 3], (k, v) => [k, v])).toStrictEqual({0: 1, 1: 2, 2: 3});
        expect(objMap({x: 1, y: 2}, (k, v) => [v, k])).toStrictEqual({1: "x", 2: "y"});
        expect(objMap({x: 1, y: 2}, (k, v) => v > 1 ? [k + k, v + v] : false)).toStrictEqual({yy: 4});
        expect(objMap({x: 1, y: 2}, () => false)).toStrictEqual({});
    });
});
