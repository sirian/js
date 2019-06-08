import {CustomError} from "../../src";

test("Test constructor", () => {
    const message = "Foo";
    const error = new CustomError(message);

    expect(error).toBeInstanceOf(CustomError);
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe(message);
    expect(error.name).toBe("CustomError");
});
