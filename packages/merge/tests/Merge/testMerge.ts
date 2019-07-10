import {Merge} from "../../src";

describe("Merge.merge", () => {
    test("Merge.merge({x: 1})", () => {
        expect(Merge.merge([])).toBe(undefined);
    });

    test("Merge.merge([{x: 1}])", () => {
        const foo = {x: 1};
        expect(Merge.merge([foo])).not.toBe(foo);
        expect(Merge.merge([foo])).toStrictEqual(foo);
        expect(Merge.merge([foo], {clone: false})).toBe(foo);
    });

    test("Merge.merge([1, 2, 3])", () => {
        const foo = [1, 2, 3];
        expect(Merge.merge([foo])).not.toBe(foo);
        expect(Merge.merge([foo])).toStrictEqual(foo);
        expect(Merge.merge([foo], {clone: false})).toBe(foo);
    });

    test("Merge.merge([array, object])", () => {
        const foo = [1, 2, 3];
        const bar = {1: 4};
        expect(Merge.merge([foo, bar])).toStrictEqual([1, 4, 3]);
        expect(Merge.merge([foo, bar], {clone: false})).toBe(foo);
    });

    test("Merge.merge([{x: 1}, {x: 2, y: 3}])", () => {
        const foo = {x: 1};
        const bar = {x: 2, y: 3};
        expect(Merge.merge([foo, bar])).toStrictEqual({x: 2, y: 3});
        expect(Merge.merge([foo, bar], {allowAdd: false})).toStrictEqual({x: 2});
    });

    test("Merge.merge([{x: {z: 1}}, {x: {z: 3}}])", () => {
        const foo = {x: {a: 1}};
        const bar = {x: {b: 2}};
        expect(Merge.merge([foo, bar])).toStrictEqual({x: {a: 1, b: 2}});
        expect(Merge.merge([foo, bar], {allowAdd: false})).toStrictEqual({x: {a: 1}});

        expect(Merge.merge([foo, bar], {deep: false})).toStrictEqual({x: {b: 2}});
        expect(Merge.merge([foo, bar], {deep: false, allowAdd: false})).toStrictEqual({x: {b: 2}});
    });

    test("Merge.merge({x: 1})", () => {
        class Foo {
            public y = 2;
            constructor(public x = 1) {
            }
        }

        const foo = new Foo();
        const actual = Merge.merge([{a: foo}, {a: {x: 2}}]);
        expect(actual).toStrictEqual({a: {x: 2}});
        expect(actual).not.toBe(foo);
    });
});
