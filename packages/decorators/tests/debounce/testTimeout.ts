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
    expect(setTimeout).toHaveBeenCalledTimes(1);
    Foo.foo(5);
    expect(setTimeout).toHaveBeenCalledTimes(1);
    setTimeout(() => Foo.foo(3), 10);

    jest.runTimersToTime(1000);
    expect(setTimeout).toHaveBeenCalledTimes(3);

    expect(calls).toStrictEqual([[3, 5], [13, 3]]);
});
