import {bindArgs} from "../../src";

describe("bindArgs", () => {
    const foo = (x, y, z, ...rest) => [x, y, z, rest];

    const data: Array<[any, any[], any[]]> = [
        [{0: 1}, [2, 3, 4], [1, 2, 3, [4]]],
        [{1: 1}, [2, 3, 4], [2, 1, 3, [4]]],
        [{2: 1}, [2, 3, 4], [2, 3, 1, [4]]],
        [{1: 10, 2: 20}, [2, 3, 4], [2, 10, 20, [3, 4]]],
        [{5: 1}, [2], [2, undefined, undefined, [undefined, undefined, 1]]],
    ];

    test.each(data)("bindArgs(%o)(...%o) === %os", (bind, args, expected) => {
        const fn = bindArgs(foo, bind) as any;
        expect(fn(...args)).toStrictEqual(expected);
    });

    test("bindArgs pass through this", () => {
        function bar(x, y) {
            return [this, x, y];
        }

        const o1 = {x: 1};
        const o2 = {x: 2};
        const o3 = {x: 3};

        const bound = bindArgs(bar, {1: o3});

        const res = bound.call(o1, o2);
        expect(res).toStrictEqual([o1, o2, o3]);
        expect(res[0]).toBe(o1);
        expect(res[1]).toBe(o2);
        expect(res[2]).toBe(o3);
    });
});
