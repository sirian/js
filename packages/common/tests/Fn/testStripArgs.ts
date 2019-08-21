import {Fn} from "../../src";

describe("Fn.stripArgs", () => {
    const data = [
        [[1], [1]],
        [[1, undefined], [1, undefined]],
        [[1, undefined, undefined], [1, undefined]],
        [[1, 2, undefined], [1, 2]],
        [[1, 2, undefined, undefined], [1, 2]],
        [[1, 2, 3], [1, 2, 3]],
        [[1, 2, 3, undefined], [1, 2, 3]],
    ];

    function foo(x: any, y: any) {
        return arguments;
    }

    test.each(data)("Fn.stripArgs(foo, %p)", (args, expected) => {
        const stripped = Fn.stripArgs(foo, args);
        expect(stripped).toStrictEqual(expected);
    });
});
