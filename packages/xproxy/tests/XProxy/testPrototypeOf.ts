import {XProxy} from "../../src";

describe("xProxy.prototypeOf", () => {
    test("xProxy.prototypeOf", () => {
        class Foo {
            public x = 1;
        }

        const foo = new Foo();
        const p = XProxy.forObject({target: foo});
        expect(Reflect.getPrototypeOf(p)).toBe(Foo.prototype);
        expect(Reflect.getPrototypeOf(foo)).toBe(Foo.prototype);

        const proto = {};
        Reflect.setPrototypeOf(p, proto);

        expect(Reflect.getPrototypeOf(p)).toBe(proto);
        expect(Reflect.getPrototypeOf(foo)).toBe(proto);
    });
});
