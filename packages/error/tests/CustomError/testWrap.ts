import {CustomError} from "../../src";

describe("CustomError.wrap", () => {
    test("wrap Error instance returns itself", () => {
        const e = new Error("foo");
        expect(CustomError.wrap(e)).toBe(e);
    });

    const data: Array<[any, string, string]> = [
        [{}, "CustomError", ""],
        [{name: "Foo"}, "Foo", ""],
        [{message: "bar"}, "CustomError", "bar"],
        [{name: "Foo", message: "bar"}, "Foo", "bar"],
        [{name: "", message: ""}, "", ""],
    ];

    test.each(data)("CustomError.wrap(%p) === {name: %p, message: %p}", (error, name, message) => {
        const e = CustomError.wrap(error);
        expect(e).toBeInstanceOf(CustomError);
        expect(e.name).toBe(name);
        expect(e.message).toBe(message);
    });
});
