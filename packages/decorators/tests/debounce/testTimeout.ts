import {debounce} from "../../src";

const data = [0, 100, 500, 1000];

test.each(data)("", (delay: number) => {
    let now = 0;

    jest.useFakeTimers();

    class Foo {
        @debounce(delay)
        public static foo() {
            expect(now).toBe(delay);
        }
    }

    setInterval(() => ++now, 1);
    Foo.foo();

    jest.advanceTimersByTime(delay);

    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), delay);
});
