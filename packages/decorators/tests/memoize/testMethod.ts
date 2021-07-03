import {memoize} from "../../src";



test("", () => {
    const x = {};
    const fn = jest.fn(() => x);

    class Foo {
        @memoize()
        public hugeTask() {
            return fn();
        }
    }

    const foo = new Foo();

    expect(fn).toBeCalledTimes(0);

    expect(foo.hugeTask()).toBe(x);
    expect(fn).toBeCalledTimes(1);

    expect(foo.hugeTask()).toBe(x);
    expect(fn).toBeCalledTimes(1);
});

test("", () => {
    const x = {};
    const fn = jest.fn(() => x);
    const symbol = Symbol();

    class Foo {
        @memoize()
        public [symbol]() {
            return fn();
        }
    }

    const foo = new Foo();

    expect(fn).toBeCalledTimes(0);

    expect(foo[symbol]()).toBe(x);
    expect(fn).toBeCalledTimes(1);

    expect(foo[symbol]()).toBe(x);
    expect(fn).toBeCalledTimes(1);
});
