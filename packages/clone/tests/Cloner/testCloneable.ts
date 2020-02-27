import {clone, Cloneable, Cloner} from "../../src";

describe("", () => {
    class Foo implements Cloneable {
        constructor(public x: number) {
        }

        public [Cloner.symbol]() {
            this.x++;
        }
    }

    const foo = new Foo(0);

    const copy = clone(foo);

    test("", () => {
        expect(foo.x).toBe(0);

        expect(copy).toBeInstanceOf(Foo);
        expect(copy.x).toBe(1);

    });

    test("", () => {
        const copy2 = clone(copy);
        expect(copy2).toBeInstanceOf(Foo);

        expect(copy2.x).toBe(2);
        expect(copy.x).toBe(1);
        expect(foo.x).toBe(0);
    });
});
