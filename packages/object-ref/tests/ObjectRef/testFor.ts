import {ObjectRef} from "../../src";

describe("ObjectRef.getId", () => {
    const foo = new class Foo {};
    const bar = {};
    const data: Array<[any, string]> = [
        [foo, "Foo#1"],
        [bar, "Object#2"],
        [{}, "Object#3"],
        [foo, "Foo#1"],
        [bar, "Object#2"],
        [{}, "Object#4"],
    ];

    test.each(data)("ObjectRef.getId(%O) === %O", (value, expected) => {
        const id = +expected.match(/(\d+)/)![1];

        expect(ObjectRef.for(value).name).toBe(expected);
        expect(ObjectRef.for(value).id).toBe(id);
    });

    test("", () => {
        expect(ObjectRef.for(foo)).toBe(ObjectRef.for(foo));
        expect(ObjectRef.for(bar)).toBe(ObjectRef.for(bar));
        expect(ObjectRef.for(foo)).not.toBe(ObjectRef.for(bar));
    });
});
