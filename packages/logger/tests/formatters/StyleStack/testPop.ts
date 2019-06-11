import {StyleStack} from "../../../src/formatters/StyleStack";

test("Test empty stack", () => {
    const stack = new StyleStack();

    expect(stack.getStack()).toHaveLength(0);

    expect(stack.pop()).toHaveLength(0);
    expect(stack.getStack()).toHaveLength(0);

    expect(stack.pop("foo")).toHaveLength(0);
    expect(stack.getStack()).toHaveLength(0);
});

test("pop() should pop only one last element", () => {
    const stack = new StyleStack();

    stack.push("foo", "bar", "baz");

    expect(stack.pop()).toStrictEqual(["baz"]);
    expect(stack.getStack()).toStrictEqual(["foo", "bar"]);

    expect(stack.pop()).toStrictEqual(["bar"]);
    expect(stack.getStack()).toStrictEqual(["foo"]);

    expect(stack.pop()).toStrictEqual(["foo"]);
    expect(stack.getStack()).toStrictEqual([]);

    expect(stack.pop()).toStrictEqual([]);
    expect(stack.getStack()).toStrictEqual([]);
});

test("pop('bar') should pop all elements after last 'bar'", () => {
    const stack = new StyleStack();

    stack.push("foo", "bar", "baz");

    expect(stack.pop("bar")).toStrictEqual(["bar", "baz"]);
    expect(stack.getStack()).toStrictEqual(["foo"]);

    expect(stack.pop("baz")).toStrictEqual([]);
    expect(stack.pop("bar")).toStrictEqual([]);
    expect(stack.getStack()).toStrictEqual(["foo"]);

    expect(stack.pop("foo")).toStrictEqual(["foo"]);
    expect(stack.getStack()).toStrictEqual([]);
});

describe("pop('foo', 'bar') should pop all elements in right order", () => {
    test("", () => {
        const stack = new StyleStack();

        stack.push("foo", "bar", "bar", "foo", "bar", "foo");

        expect(stack.pop("bar", "foo")).toStrictEqual(["bar", "foo"]);
        expect(stack.getStack()).toStrictEqual(["foo", "bar", "bar", "foo"]);
    });

    test("", () => {
        const stack = new StyleStack();

        stack.push("foo", "bar", "bar", "foo", "bar", "foo");

        expect(stack.pop("foo", "bar")).toStrictEqual(["foo", "bar", "foo"]);
        expect(stack.getStack()).toStrictEqual(["foo", "bar", "bar"]);
    });
});
