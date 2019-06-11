import {Var} from "../../src";

describe("Fn", () => {
    function Foo() {}

    class Bar extends (Foo as any) {}

    const data: Array<[any, boolean]> = [
        [null, false],
        [1, false],
        [{}, false],
        [function* gen(): any {}, false],
        [async function asyncFn() {}, false],
        [async function* asyncGen(): any {}, false],
        [() => void 0, false],
        [async () => void 0, false],

        [function() {}, true],
        [function fn() {}, true],
        [Object, true],
        [Function, true],
        [class {}, true],
        [class extends Function {}, true],
        [Foo, true],
        [Bar, true],
        [Foo.bind(null), true],
        [Foo.bind(Foo), true],
        [Bar.bind(null), true],
        [Bar.bind(Bar), true],
        [new Proxy(Foo, {}), true],
        [new Proxy(Bar, {}), true],
    ];

    test.each(data)("Var.isConstructor(%O) === %p", (value, expected) => {
        expect(Var.isConstructor(value)).toBe(expected);
    });
});
