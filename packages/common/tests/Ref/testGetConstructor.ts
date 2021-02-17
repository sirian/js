import {getConstructor, noop} from "../../src";

describe("getConstructor", () => {
    const data: Array<[any, any]> = [
        [null, undefined],
        [undefined, undefined],
        [{}, Object],
        [noop, Function],
        [0, Number],
        [3, Number],
        [false, Boolean],
        [true, Boolean],
        ["", String],
        ["foo", String],
    ];
    test.each(data)("getConstructor(%O) === %O", (value, expected) => {
        expect(getConstructor(value)).toBe(expected);

    });
});
