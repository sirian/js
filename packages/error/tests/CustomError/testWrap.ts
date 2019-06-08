import {CustomError} from "../../src";

test("wrap Error instance returns itself", () => {
    const e = new Error("foo");
    expect(CustomError.wrap(e)).toBe(e);
});

test("", () => {
    const e = CustomError.wrap({name: "Foo"});
    expect(e).toBeInstanceOf(CustomError);
    expect(e.name).toBe("Foo");
    expect(e.message).toBe("");
});

test("", () => {
    const e = CustomError.wrap({message: "bar"});
    expect(e).toBeInstanceOf(CustomError);
    expect(e.name).toBe("CustomError");
    expect(e.message).toBe("bar");
});

test("", () => {
    const e = CustomError.wrap({name: "Foo", message: "bar"});
    expect(e).toBeInstanceOf(CustomError);
    expect(e.name).toBe("Foo");
    expect(e.message).toBe("bar");
});

test("", () => {
    const e = CustomError.wrap({name: "", message: ""});
    expect(e).toBeInstanceOf(CustomError);
    expect(e.name).toBe("");
    expect(e.message).toBe("");
});
