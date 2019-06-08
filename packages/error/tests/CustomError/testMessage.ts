import {CustomError} from "../../src";

test("Test message", () => {
    const message = "Foo";
    const error = new CustomError(message);
    expect(error.message).toBe(message);
});

test("Test empty message", () => {
    const error = new CustomError();
    expect(error.message).toBe("");
});

test("Test overwrite", () => {
    const message = "Foo";
    const error = new CustomError(message);
    expect(error.message).toBe(message);

    const newMessage = "Bar";
    error.message = newMessage;
    expect(error.message).toBe(newMessage);

    delete error.message;

    expect(error.message).toBe("");
});
