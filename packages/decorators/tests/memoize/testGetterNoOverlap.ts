import {memoize} from "../../src";

test("", () => {
    class Foo {
        constructor(public foo: number) {}

        @memoize()
        get bar() {
            return this.foo++;
        }
    }

    const f1 = new Foo(0);
    const f2 = new Foo(10);

    expect(f1.foo).toBe(0);
    expect(f2.foo).toBe(10);

    expect(f1.bar).toBe(0);
    expect(f2.bar).toBe(10);

    expect(f1.foo).toBe(1);
    expect(f2.foo).toBe(11);

    expect(f1.bar).toBe(0);
    expect(f2.bar).toBe(10);

    expect(f1.foo).toBe(1);
    expect(f2.foo).toBe(11);
});
