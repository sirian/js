import {AggregateError, CustomError} from "../../src";

describe("CustomError.wrap", () => {
    const self = [
        new Error("foo"),
        new CustomError("foo"),
        Function("try {foo} catch(e) {return e}")(),
    ];
    test.each(self)("wrap %p returns itself", (e) => {
        expect(CustomError.wrap(e)).toBe(e);
        const e1 = {
            stack: e.stack,
            message: e.message,
            name: e.name,
        };
        expect(CustomError.wrap(e1)).toBeInstanceOf(CustomError);
        expect(CustomError.wrap(e1)).toMatchObject(e1);
    });

    test("wrap CustomError instance returns itself", () => {
        const e = new CustomError("foo");
        expect(CustomError.wrap(e)).toBe(e);
        const e1 = {stack: e.stack, message: "bar"};
        expect(CustomError.wrap(e1)).toBeInstanceOf(CustomError);
        expect(CustomError.wrap(e1)).toMatchObject(e1);
    });

    const data: Array<[any, string, string]> = [
        [{}, "CustomError", ""],
        [0, "CustomError", "0"],
        [null, "CustomError", ""],
        [undefined, "CustomError", ""],
        ["foo", "CustomError", "foo"],
        [{name: "Foo"}, "Foo", ""],
        [{name: "Foo", stack: "stack"}, "Foo", ""],
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
