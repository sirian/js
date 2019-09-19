import {EventEmitter} from "../../src";

describe("EventEmitter.emit", () => {
    const emitter = new EventEmitter();

    const foo1 = jest.fn();
    const foo2 = jest.fn();
    const bar1 = jest.fn();

    emitter.addListener("foo", foo1);
    emitter.addListener("foo", foo2);
    emitter.addListener("bar", bar1);

    test("EventEmitter.emit(foo)", () => {
        jest.resetAllMocks();
        emitter.emit("foo");
        expect(foo1).toHaveBeenCalledTimes(1);
        expect(foo2).toHaveBeenCalledTimes(1);
        expect(bar1).toHaveBeenCalledTimes(0);
    });

    test("EventEmitter.emit(bar)", () => {
        jest.resetAllMocks();
        emitter.emit("bar");
        expect(foo1).toHaveBeenCalledTimes(0);
        expect(foo2).toHaveBeenCalledTimes(0);
        expect(bar1).toHaveBeenCalledTimes(1);
    });

    test("EventEmitter.emit(baz)", () => {
        jest.resetAllMocks();
        emitter.emit("baz");
        expect(foo1).toHaveBeenCalledTimes(0);
        expect(foo2).toHaveBeenCalledTimes(0);
        expect(bar1).toHaveBeenCalledTimes(0);
    });
});
