import {stringifyFn} from "../../src";

describe("stringifyFn", () => {
    const data = [
        function() {
            return "foo";
        },
        async function() {
            return Promise.resolve("foo");
        },
        function foo() {
            return "foo";
        },
        async function foo() {
            return Promise.resolve("foo");
        },
        function* foo() {
            yield "foo";
            return "bar";
        },
        Function,
        Object,
    ];

    test.each(data)("stringifyFn(%O)", (fn) => {
        const result = stringifyFn(fn);
        expect(result).toEqual(Function.prototype.toString.call(fn));
        expect(result).toEqual(String(fn));
    });
});
