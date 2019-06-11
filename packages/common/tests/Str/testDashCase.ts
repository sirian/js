import {Str} from "../../src";

describe("", () => {
    const data: Array<[any, string]> = [
        ["the_dasherize_string_method", "the-dasherize-string-method"],
        ["TheDasherizeStringMethod", "-the-dasherize-string-method"],
        ["thisIsATest", "this-is-a-test"],
        ["this Is A Test", "this-is-a-test"],
        ["thisIsATest123", "this-is-a-test123"],
        ["123thisIsATest", "123this-is-a-test"],
        ["the dasherize string method", "the-dasherize-string-method"],
        ["the  dasherize string method  ", "the-dasherize-string-method"],
        ["téléphone", "téléphone"],
        ["foo$bar", "foo$bar"],
        ["input with a-dash", "input-with-a-dash"],
        ["", ""],
        [null, ""],
        [undefined, ""],
        [123, "123"],
    ];

    test.each(data)("Str.dashCash(%p) === %p", (value, expected) => {
        expect(Str.dashCase(value)).toBe(expected);
    });
});
