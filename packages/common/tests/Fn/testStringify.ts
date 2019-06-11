import {_Function, _Object, Fn} from "../../src";

describe("", () => {
    const data = [
        function() {
            return "foo";
        },
        async function() {
            return "foo";
        },
        function foo() {
            return "foo";
        },
        async function foo() {
            return "foo";
        },
        function* foo() {
            yield "foo";
            return "bar";
        },
        _Function,
        _Object,
    ];

    test.each(data)("Fn.stringify(%O)", (fn) => {
        const result = Fn.stringify(fn);
        expect(result).toEqual(_Function.prototype.toString.call(fn));
        expect(result).toEqual("" + fn);
    });
});
