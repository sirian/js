import {Cloneable, Cloner} from "../../src";

describe("", () => {
    class Foo implements Cloneable {
        constructor(public x: number) {
        }

        public [Cloner.symbol]() {
            this.x++;
        }
    }

    const foo = new Foo(0);

    const clone = Cloner.clone(foo);

    test("", () => {
        expect(foo.x).toBe(0);

        expect(clone).toBeInstanceOf(Foo);
        expect(clone.x).toBe(1);

    });

    test("", () => {
        const clone2 = Cloner.clone(clone);
        expect(clone2).toBeInstanceOf(Foo);

        expect(clone2.x).toBe(2);
        expect(clone.x).toBe(1);
        expect(foo.x).toBe(0);
    });
});
