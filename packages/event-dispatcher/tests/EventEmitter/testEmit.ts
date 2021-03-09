import {MultiDispatcher} from "../../src";

describe("MultiDispatcher.emit", () => {
    const emitter = new MultiDispatcher();

    const foo1 = jest.fn();
    const foo2 = jest.fn();
    const bar1 = jest.fn();

    emitter.addListener("foo", foo1);
    emitter.addListener("foo", foo2);
    emitter.addListener("bar", bar1);

    test("MultiDispatcher.emit(foo)", () => {
        jest.resetAllMocks();
        emitter.emit("foo");
        expect(foo1).toHaveBeenCalledTimes(1);
        expect(foo2).toHaveBeenCalledTimes(1);
        expect(bar1).toHaveBeenCalledTimes(0);
    });

    test("MultiDispatcher.emit(bar)", () => {
        jest.resetAllMocks();
        emitter.emit("bar");
        expect(foo1).toHaveBeenCalledTimes(0);
        expect(foo2).toHaveBeenCalledTimes(0);
        expect(bar1).toHaveBeenCalledTimes(1);
    });

    test("MultiDispatcher.emit(baz)", () => {
        jest.resetAllMocks();
        emitter.emit("baz");
        expect(foo1).toHaveBeenCalledTimes(0);
        expect(foo2).toHaveBeenCalledTimes(0);
        expect(bar1).toHaveBeenCalledTimes(0);
    });
});
