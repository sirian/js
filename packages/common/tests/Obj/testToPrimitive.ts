import {Primitive} from "@sirian/ts-extra-types";
import {Obj, Var} from "../../src";

describe("Obj.toPrimitive", () => {
    const primitives: Primitive[] = [1, true, "foo", Symbol.iterator, Symbol(), undefined, null];

    const data: Array<[any, Primitive]> = [
        ...primitives.map<[any, Primitive]>((x) => [x, x]),
        ...primitives.filter((x) => !Var.isNullable(x)).map<[any, Primitive]>((x) => [Object(x), x]),
        [{[Symbol.toPrimitive]: () => 3}, 3],
        [{[Symbol.toPrimitive]: () => "foo"}, "foo"],
        [{[Symbol.toPrimitive]: () => "foo", valueOf: () => "bar"}, "foo"],
        [{valueOf: () => "bar"}, "bar"],
        [Object.assign(Object(3), {valueOf: () => "bar"}), "bar"],
        [Object.assign(Object(3), {[Symbol.toPrimitive]: () => 10}), 10],
    ];

    test.each(data)("Obj.toPrimitive(%o) === %o", (x, expected) => {
        expect(Obj.toPrimitive(x)).toBe(expected);
    });

    test("Obj.toPrimitive(Date)", () => {
        const date = new Date();
        expect(Obj.toPrimitive(date)).toBe("" + date);
    });
});
