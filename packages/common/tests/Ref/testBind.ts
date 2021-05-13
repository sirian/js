import {bind} from "../../src";

describe("bind", () => {
    function foo(this: any, ...args: any[]) {
        return [this, args];
    }

    const o = {x: 1};

    const data = [
        [[], [10, 20, "a"]],
        [[10], [20, "a"]],
        [[10, 20], ["a"]],
        [[10, 20, "a"], []],
    ] as const;

    test.each(data)("bind(%o, ...%o)", (args, rest) => {
        const fn = bind(foo, o, ...args);
        const expected = [o, [...args, ...rest]];
        expect(fn(...rest)).toStrictEqual(expected);
    });
});
