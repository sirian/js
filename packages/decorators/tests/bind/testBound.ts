import {bind} from "../../src";

test("", () => {
    class Foo {
        @bind
        public foo() {
            return this;
        }
    }

    const c1 = new Foo();

    expect(c1.foo()).toBe(c1);

    const p = c1.foo;
    expect(p()).toBe(c1);

    const a = {};
    expect(c1.foo.call(a)).toBe(c1);
    expect(c1.foo.call(null)).toBe(c1);

    const c2 = new Foo();

    expect(c1.foo()).toBe(c1);
    expect(c2.foo()).toBe(c2);
});

test("", () => {
    class Foo {
        // tslint:disable-line
        public x = 1;

        @bind
        public foo() {
            return this.x;
        }
    }

    const c = new Foo();
    expect(c.x).toBe(1);
    expect(c.foo()).toBe(1);
    expect(c.foo.call({})).toBe(1);
    expect(c.foo.call(null)).toBe(1);
    expect(c.foo.call(undefined)).toBe(1);
});
