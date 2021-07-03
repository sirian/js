import {bind} from "../../src";

test("", () => {
    class Foo {
        @bind()
        public foo() {
            return this;
        }
    }

    const c1 = new Foo();

    expect(c1.foo()).toBe(c1);

    // eslint-disable-next-line @typescript-eslint/unbound-method
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

        public x = 1;

        @bind()
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

test("", () => {

    const fn1 = jest.fn(function(this: any, o) {
        expect(this).toBe(o);
        return 1;
    });
    const fn2 = jest.fn(function(this: any, o) {
        expect(this).toBe(o);
        return 2;
    });

    class Foo {
        protected fns = [fn1, fn2, fn1];

        @bind()
        public get foo() {
            return this.fns.pop()!;
        }
    }

    const f = new Foo();
    const foo1 = f.foo;
    const foo2 = f.foo;
    const foo3 = f.foo;

    expect(foo1 === foo2).toBe(false);
    expect(foo1 === foo3).toBe(true);
    expect(foo1(f)).toBe(1);
    expect(foo2(f)).toBe(2);
    expect(foo3(f)).toBe(1);
});
