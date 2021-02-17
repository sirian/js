import {objClear} from "../../src";

describe("Obj.clear", () => {
    class Foo {
        public y = 1;

        public static foo() {}

        get x() { return 1; }

        public z() {}
    }

    const data: Array<[any, any]> = [
        [[1, 2, 3], []],
        [{x: 1}, {}],
        [new Foo(), Object.create(Foo.prototype)],
        [Object("foo"), Object("foo")],
    ];

    test.each(data)("Obj.clear(%o) === %o", (value, expected) => {
        const result = objClear(value);
        expect(result).toBe(value);
        expect(result).toStrictEqual(expected);
    });
});
