import {Var} from "../../src";

describe("Var.isSubclassOf", () => {
    class Foo extends Number {}

    class Bar extends Foo {}

    const data: Array<[any, any, boolean]> = [
        [undefined, undefined, false],
        [undefined, null, false],
        [false, null, false],
        [null, class {}, false],
        [class {}, null, false],
        [class {}, Function, false],
        [class {}, Object, true],
        [Number, Number, true],
        [Number, Function, false],
        [Foo, Foo, true],
        [Foo, Number, true],
        [Foo, Object, true],
        [Foo, Function, false],
        [Foo, String, false],
        [Foo, class extends Number {}, false],
        [Foo, Bar, false],
        [Bar, Bar, true],
        [Bar, Foo, true],
        [Bar, Number, true],
        [Bar, Object, true],
        [Bar, Function, false],
        [class extends Function {}, Function, true],
        [function() {}, Function, false],
        [async function() {}, Function, false],
        [new Function(), Function, false],
        [() => 1, Function, false],
        [Function, Function, true],
        [() => 1, () => 1, false],
    ];

    test.each(data)("Var.isSubclassOf(%p, %p) === %p", (a, b, expected) => {
        expect(Var.isSubclassOf(a, b)).toBe(expected);
    });
});
