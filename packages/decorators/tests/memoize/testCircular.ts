import {memoize} from "../../src";

describe("memoize()", () => {
    test("test circular", () => {
        class Foo {
            @memoize()
            public get foo(): any {
                return this.bar;
            }

            @memoize()
            public get bar(): any {
                return this.foo;
            }
        }
        const foo = new Foo();
        expect(() => foo.foo).toThrow("[memoize] circular call");
    });
});
