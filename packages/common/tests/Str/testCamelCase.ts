import {camelCase} from "../../src";

describe("", () => {
    const data: Array<[any, string]> = [
        ["the_camelize_string_method", "theCamelizeStringMethod"],
        ["webkit-transform", "webkitTransform"],
        ["-the-camelize-string-method", "TheCamelizeStringMethod"],
        ["_the_camelize_string_method", "TheCamelizeStringMethod"],
        ["The-camelize-string-method", "TheCamelizeStringMethod"],
        ["the camelize string method", "theCamelizeStringMethod"],
        [" the camelize  string method", "theCamelizeStringMethod"],
        ["the camelize   string method", "theCamelizeStringMethod"],
        [" with   spaces", "withSpaces"],
        ["_som eWeird---name-", "SomEWeirdName"],
        ["", ""],
        [null, ""],
        [undefined, ""],
        [123, "123"],
        [Symbol.iterator, ""],
        [Symbol(), ""],
        [Symbol.for("foo"), ""],
    ];

    test.each(data)("Str.camelize(%p) === %p", (value, expected) => {
        expect(camelCase(value)).toBe(expected);
    });
});
