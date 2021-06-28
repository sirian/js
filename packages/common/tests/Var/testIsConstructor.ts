import {isConstructor, isObjectOrFunction} from "../../src";

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
        [async () => void 0, false], // eslint-disable-line @typescript-eslint/require-await
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
    ];

    test.each(data)("Var.isConstructor(%O) === %p", (value, expected) => {
        expect(isConstructor(value)).toBe(expected);
        if (isObjectOrFunction(value)) {
            const proxy = new Proxy(value, {});
            expect(isConstructor(proxy)).toBe(expected);
        }
    });
});
