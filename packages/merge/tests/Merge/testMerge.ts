import {Merge, MergeOptions} from "../../src";

describe("Merge.merge", () => {
    function expectMerge(x: any, y: any, o?: MergeOptions) {
        const merged = Merge.merge([x, y], o);
        return expect(merged);
    }

    test("Merge.merge({x: 1})", () => {
        expect(Merge.merge([])).toBe(undefined);
    });

    test("Merge.merge([{x: 1}])", () => {
        const foo = {x: 1};
        expect(Merge.merge([foo])).toBe(foo);
        expect(Merge.merge([foo, {}], {clone: false})).toBe(foo);
    });

    test("Merge.merge([1, 2, 3])", () => {
        const foo = [1, 2, 3];
        expect(Merge.merge([foo])).toBe(foo);
        expect(Merge.merge([foo, {}], {clone: false})).toBe(foo);
    });

    test("Merge.merge([array, object])", () => {
        const foo = [1, 2, 3];
        const bar = {1: 4};
        expectMerge(foo, bar).toStrictEqual([1, 4, 3]);
        expectMerge(foo, bar, {clone: false}).toBe(foo);
    });

    test("Merge.merge([{x: 1}, {x: 2, y: 3}])", () => {
        const foo = {x: 1};
        const bar = {x: 2, y: 3};
        expectMerge(foo, bar).toStrictEqual({x: 2, y: 3});
        expectMerge(foo, bar, {allowAdd: false}).toStrictEqual({x: 2});
    });

    test("Merge.merge([{x: {z: 1}}, {x: {z: 3}}])", () => {
        const foo = {x: {a: 1}};
        const bar = {x: {b: 2}};
        expectMerge(foo, bar).toStrictEqual({x: {a: 1, b: 2}});
        expectMerge(foo, bar, {allowAdd: false}).toStrictEqual({x: {a: 1}});

        expectMerge(foo, bar, {maxDepth: 0}).toStrictEqual({x: {b: 2}});
        expectMerge(foo, bar, {maxDepth: 0, allowAdd: false}).toStrictEqual({x: {b: 2}});
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

    test("Merge array and plain object", () => {
        expectMerge([1, 2, 3], {1: 4}).toStrictEqual([1, 4, 3]);
        expectMerge({1: 4}, [1, 2, 3]).toStrictEqual([1, 2, 3]);
        expectMerge([1, 2, 3], [4, 5]).toStrictEqual([4, 5]);
        expectMerge([4, 5], [1, 2, 3]).toStrictEqual([1, 2, 3]);
    });
});
