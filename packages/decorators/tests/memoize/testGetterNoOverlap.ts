import {memoize} from "../../src";

test("", () => {
    class Foo {
        constructor(protected foo: number) {}

        @memoize
        get bar() {
            return this.foo;
        }
    }

    const f1 = new Foo(1);
    const f2 = new Foo(2);

    expect(f1.bar).toBe(1);
    expect(f2.bar).toBe(2);
});
