import {debounce} from "../../src";

test("@debounce timeout", () => {
    let now = 0;

    jest.useFakeTimers();
    jest.clearAllTimers();

    const calls: Array<[number, number]> = [];

    class Foo {
        @debounce({ms: (thisArg, [x]) => x})
        public static foo(value: number) {
            calls.push([now, value]);
        }
    }

    setInterval(() => ++now, 1);
    Foo.foo(3);
    expect(calls).toStrictEqual([]);
    Foo.foo(5);
    setTimeout(() => Foo.foo(4), 10);
    jest.advanceTimersByTime(2);
    expect(calls).toStrictEqual([]);
    jest.advanceTimersByTime(1);
    expect(calls).toStrictEqual([[3, 5]]);

    jest.advanceTimersByTime(7);
    expect(calls).toStrictEqual([[3, 5]]);

    jest.advanceTimersByTime(3);
    expect(calls).toStrictEqual([[3, 5]]);
    jest.advanceTimersByTime(1);
    expect(calls).toStrictEqual([[3, 5], [14, 4]]);

    jest.runOnlyPendingTimers();
    expect(calls).toStrictEqual([[3, 5], [14, 4]]);
});
