import {Var} from "@sirian/common";
import {Mixin} from "../../src";

describe("", () => {
    const Timestampable = Mixin.createConstructable((superclass) => class Timestampable extends superclass {
        public createdAt = new Date();
    });

    test("instance of MixinFn should be instanceof MixinFn", () => {
        const obj = new Timestampable();
        expect(obj).toBeInstanceOf(Timestampable);
        expect(Var.isInstanceOf(obj, Timestampable)).toBe(true);
        expect(Mixin.has(obj, Timestampable)).toBe(true);
    });

    test("instance of class Foo extends MixinFn should be instanceof MixinFn and Foo", () => {
        class Foo extends Timestampable {
            public foo() {
                return this.createdAt;
            }
        }

        const foo = new Foo();

        expect(foo).toBeInstanceOf(Timestampable);
        expect(foo).toBeInstanceOf(Foo);
        expect(foo.createdAt).toBeInstanceOf(Date);

        expect(foo.foo()).toBe(foo.createdAt);
    });

    test("instance of class Bar extends mix(Foo, Timestampable) should be instanceof Timestampable, Foo, Bar", () => {
        class Foo {
            public x = 1;
            public y = 2;
        }

        class Bar extends Mixin.mix(Foo, Timestampable) {
            public y = 3;
        }

        const bar = new Bar();

        expect(bar).toBeInstanceOf(Foo);
        expect(bar).toBeInstanceOf(Bar);
        expect(bar).toBeInstanceOf(Timestampable);
        expect(bar.x).toBe(1);
        expect(bar.y).toBe(3);
    });
});
