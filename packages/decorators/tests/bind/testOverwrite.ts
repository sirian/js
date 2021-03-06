import {bind} from "../../src";

describe("", () => {
    class A {
        public x = 1;

        @bind()
        public foo() {
            return this.x;
        }
    }

    test("", () => {
        const a = new A();
        // eslint-disable-next-line @typescript-eslint/unbound-method
        const foo = a.foo;
        expect(foo()).toBe(1);

        const fn = () => 3;
        a.foo = fn;
        a.x = 2;
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(a.foo).toBe(fn);
        expect(a.foo()).toBe(3);
        expect(foo()).toBe(2);
    });

    test("", () => {
        const a = new A();
        // eslint-disable-next-line @typescript-eslint/unbound-method
        const foo = a.foo;
        expect(foo()).toBe(1);

        const fn = () => 3;
        Object.assign(a, {
            foo: fn,
            x: 2,
        });

        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(a.foo).toBe(fn);
        expect(a.foo()).toBe(3);
        expect(foo()).toBe(2);
    });
});
