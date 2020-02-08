import {callableClass} from "../../src";

test("Test callableClass", () => {

    const Foo = callableClass("zoo", class Bar {
        constructor(public x: number) {}

        public static zoo(x: number) {
            return new Bar(x * 2);
        }
    });

    const foo1 = Foo(3);
    expect(foo1).toBeInstanceOf(Foo);
    expect(foo1.x).toBe(6);

    const foo2 = Foo(6);
    expect(foo2).toBeInstanceOf(Foo);
    expect(foo2.x).toBe(12);

    const foo3 = new Foo(2);
    expect(foo3).toBeInstanceOf(Foo);
    expect(foo3.x).toBe(2);
});
