import {Ref} from "../../src";

describe("Ref.construct", () => {
    class Foo {

    }

    test("", () => {
        expect(Ref.construct(Foo)).toBeInstanceOf(Foo);
        expect(Ref.construct(Foo, [])).toBeInstanceOf(Foo);
        expect(Ref.construct(Foo, [], undefined)).toBeInstanceOf(Foo);
    });
});
