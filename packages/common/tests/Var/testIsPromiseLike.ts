import {Var} from "../../src";

describe("", () => {
    const data: Array<[any, boolean]> = [
        [false, false],
        [null, false],
        [undefined, false],
        [{}, false],
        [[], false],
        [Promise.resolve(), true],
        [{then: 1}, false],
        [{then: () => 1}, true],
    ];

    test.each(data)("Var.isPromiseLike(%o) === %o", (value, expected) => {
        expect(Var.isPromiseLike(value)).toBe(expected);
    });
});
