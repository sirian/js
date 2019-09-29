import {XProxy} from "../../src";

describe("xProxy.ownKeys", () => {
    test("xProxy.ownKeys", () => {
        class Foo {
            public x = 1;

            public get y() {
                return 2;
            }

            public z() {}
        }

        const foo = new Foo();
        const p = XProxy.forObject({target: foo});
        for (const k of ["x", "y", "z", "hasOwnProperty"]) {
            expect(Reflect.has(p, k)).toBe(true);
            expect(Reflect.has(foo, k)).toBe(true);

            expect(k in foo).toBe(true);
            expect(k in p).toBe(true);
        }

        for (const k of ["a", "b"]) {
            expect(Reflect.has(p, k)).toBe(false);
            expect(Reflect.has(foo, k)).toBe(false);

            expect(k in foo).toBe(false);
            expect(k in p).toBe(false);
        }
    });
});
