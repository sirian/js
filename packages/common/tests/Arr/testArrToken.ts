import {arrToken} from "../../src";

describe("argsToken", () => {
    const data = [
        [],
        [null],
        [undefined],
        [null, undefined],
        [undefined, null],
        [{x: 1}],
        [{x: 1}, {x: 1}],
        [{x: 1}, {x: 2}],
        [{x: 1}, 1],
        [1, {x: 1}],
        [NaN, {foo: 2}, {bar: 3}],
    ] as const;

    test.each(data.map((d) => [d]))("%O", (args) => {
        const t1 = arrToken(...args);

        expect(t1).toStrictEqual(args);
        expect(t1).not.toBe(args);

        for (const d of data) {
            const t = arrToken(...d);

            const exp = d === args ? expect(t) : expect(t).not;

            exp.toStrictEqual(args);
            exp.toBe(t1);
        }
    });
});
