import {Fn} from "../../src";

describe("Fn.compose", () => {
    const list = <T>(x: T) => [x];
    const box = <T>(value: T) => ({value});

    test("Fn.compose(list, box)", () => {
        const fn = Fn.compose(list, box);
        const expected = {value: [3]};
        const result: typeof expected = fn(3);

        expect(result).toStrictEqual(expected);
    });

    test("Fn.compose(list, list)", () => {
        const fn = Fn.compose(list, list);
        const expected = [[3]];
        const result: typeof expected = fn(3);

        expect(result).toStrictEqual(expected);
    });

    test("Fn.compose(list, boxList)", () => {
        const boxList = Fn.compose(list, box);
        const fn = Fn.compose(list, boxList);
        const expected = {value: [[3]]};
        const result: typeof expected = fn(3);

        expect(result).toStrictEqual(expected);
    });
});
