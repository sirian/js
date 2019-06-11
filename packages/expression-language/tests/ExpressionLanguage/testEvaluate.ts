import {Args} from "@sirian/ts-extra-types";
import {ExpressionLanguage} from "../../src";

const data: Array<[string, number]> = [
    ["1", 1],
    ["2 + 2", 4],
    ["2 + 2 * 2", 6],
    ["2 * 2 + 2", 6],
    ["(2 + 2) * 2", 8],
    ["(1 + 2) * (3 + 4) - 1", 20],
];

test.each(data)("evaluate('%s') === %o", (expression, expected) => {
    const l = new ExpressionLanguage();
    expect(l.evaluate(expression)).toBe(expected);
});

test("Throw on undefined variable", () => {
    const l = new ExpressionLanguage();
    expect(() => l.evaluate("x * 2")).toThrow();
});

test("Variables support", () => {
    const l = new ExpressionLanguage();
    expect(l.evaluate("x - y * a", {y: 2, a: 5, x: 3})).toBe(-7);
});

test("Function support", () => {
    const l = new ExpressionLanguage({
        functions: {
            json_encode: (...args: Args<typeof JSON["stringify"]>) => JSON.stringify(...args),
        },
    });

    expect(l.evaluate("json_encode({b: x, a: 'bar'})", {x: "foo"})).toBe(`{"b":"foo","a":"bar"}`);
});
