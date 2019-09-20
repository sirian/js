import {EventEmitter} from "../../src";

describe("EventEmitter.once", () => {
    test("EventEmitter.once", () => {
        const e = new EventEmitter();
        const foo1 = jest.fn(() => e.emit("foo"));
        const foo2 = jest.fn(() => e.emit("bar"));
        const bar = jest.fn(() => e.emit("foo"));

        e.once("foo", foo1);
        e.once("foo", foo2);
        e.once("bar", bar);

        e.emit("foo");

        expect(foo1).toHaveBeenCalledTimes(1);
        expect(foo2).toHaveBeenCalledTimes(1);
        expect(bar).toHaveBeenCalledTimes(1);
    });
});
