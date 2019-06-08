import {Var} from "../../src";

describe("Var.isSubclassOf", () => {
    const data: Array<[any, any, boolean]> = [
        [undefined, undefined, false],
        [undefined, null, false],
        [false, null, false],
        [null, class {}, false],
        [class {}, null, false],
        [class {}, Function, false],
        [Number, Number, true],
        [class extends Number {}, Number, true],
        [class Foo extends Number {}, Number, true],
        [class Foo extends Number {}, class Foo extends Number {}, false],
        [class Foo extends Number {}, class Foo extends String {}, false],
        [class Foo extends Number {}, class Foo extends String {}, false],
        [new Function(), Function, false],
        [class extends Function {}, Function, true],
        [Function, Function, true],
        [() => 1, Function, false],
        [async () => 1, () => 1, false],
    ];

    test.each(data)("Var.isSubclassOf(%o, %o) === %o", (a, b, expected) => {
        expect(Var.isSubclassOf(a, b)).toBe(expected);
    });
});
