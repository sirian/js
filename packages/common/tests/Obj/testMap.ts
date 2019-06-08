import {Obj, Var} from "../../src";

describe("", () => {
    test("", () => {
        expect(Obj.map({x: 1, y: 2}, (value) => value * 2)).toStrictEqual({x: 2, y: 4});
        expect(Obj.map({x: 1, y: 2, z: null}, Var.stringify)).toStrictEqual({x: "1", y: "2", z: ""});
    });
});
