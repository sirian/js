import {argsToken} from "../../src";

describe("argsToken", () => {
    test("argsToken()", () => {
        const token1 = argsToken();
        expect(token1).toStrictEqual({});
        expect(argsToken()).toBe(token1);

        const token2 = argsToken(undefined);
        expect(token2).not.toBe(token1);
        expect(token2).toStrictEqual({0: undefined});

        const token3 = argsToken(null);
        expect(token3).not.toBe(token1);
        expect(token3).not.toBe(token2);
        expect(token3).toStrictEqual({0: null});
    });

    test("argsToken([obj, 2])", () => {
        const obj1 = {x: 1};
        const obj2 = {x: 2};

        const token1 = argsToken(obj1, 2);
        expect(token1).toStrictEqual({...[obj1, 2]});

        expect(argsToken(obj1, 2)).toBe(token1);

        const token2 = argsToken(obj2, 2);
        expect(token2).toStrictEqual({...[obj2, 2]});
        expect(token2).not.toBe(token1);
        expect(argsToken(obj2, 2)).toBe(token2);
    });
});
