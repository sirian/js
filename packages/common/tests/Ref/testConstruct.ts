import {construct, setPrototype} from "../../src";

describe("construct", () => {
    test("construct without args", () => {
        class Foo {

        }

        expect(construct(Foo)).toBeInstanceOf(Foo);
        expect(construct(Foo, [])).toBeInstanceOf(Foo);
        expect(construct(Foo, [], undefined)).toBeInstanceOf(Foo);
    });

    test("construct with args", () => {
        class Foo {
            constructor(public x, public y = 3) {}
        }

        class Zoo {
        }

        expect(construct(Foo, [3])).toStrictEqual(new Foo(3));

        expect(construct(Foo, [3, 4])).toStrictEqual(new Foo(3, 4));
        expect(construct(Foo, [3, 4], undefined)).toStrictEqual(new Foo(3, 4));

        const z = new Foo(3, 4);
        setPrototype(z, Zoo.prototype);
        expect(construct(Foo, [3, 4], Zoo)).toStrictEqual(z);
    });
});
