import {MultiDispatcher} from "../../src";

describe("MultiDispatcher.once", () => {
    test("MultiDispatcher.once", () => {
        const e = new MultiDispatcher();
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
