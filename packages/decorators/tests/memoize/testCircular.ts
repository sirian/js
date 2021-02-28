import {memoize} from "../../src";

describe("", () => {
    test("", () => {
        class Foo {
            @memoize
            public get foo(): any {
                return this.bar;
            }

            @memoize
            public get bar(): any {
                return this.foo;
            }
        }
        const foo = new Foo();
        expect(() => foo.foo).toThrow("Circular @memoize call detected");
    });
});
