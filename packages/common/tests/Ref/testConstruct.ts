import {construct} from "../../src";

describe("Ref.construct", () => {
    class Foo {

    }

    test("", () => {
        expect(construct(Foo)).toBeInstanceOf(Foo);
        expect(construct(Foo, [])).toBeInstanceOf(Foo);
        expect(construct(Foo, [], undefined)).toBeInstanceOf(Foo);
    });
});
