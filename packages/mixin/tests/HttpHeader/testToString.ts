import {Unicode} from "@sirian/unicode";
import {HttpHeader, HttpHeaderValue} from "../../src";

describe("toString", () => {
    const data: Array<[string, HttpHeaderValue, string]> = [
        ["foo", "bar", "Foo: bar"],
        ["x-FOO", "bar", "X-Foo: bar"],
        ["Foo", "", "Foo: "],
        ["bar", Unicode.stringToBytes("foo"), "Bar: foo"],
    ];

    test.each(data)("HttpHeader.toString(%o)", (name, value, expected) => {
        const h = new HttpHeader(name, value);
        expect(h.toString()).toBe(expected);
    });
});
