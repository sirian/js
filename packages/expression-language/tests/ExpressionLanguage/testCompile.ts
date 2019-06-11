import {ExpressionLanguage} from "../../src";

test("Compile simple expression function", () => {
    const l = new ExpressionLanguage({
        functions: {
            max: (...args: any[]) => Math.max(...args),
        },
    });

    const compiled = l.compile("max(a, b, c) + 1", ["a", "b", "c"]);
    expect(compiled).toBe("(((...args) => Math.max(...args))(a, b, c) + 1)");
});

test("Compile expression function", () => {
    const l = new ExpressionLanguage({
        functions: {
            max: {
                compile: (...args: any[]) => `Math.max(${args.join(", ")})`,
                evaluate: (...args) => Math.max(...args),
            },
        },
    });

    const compiled = l.compile("max(a, b, c) + 1", ["a", "b", "c"]);
    expect(compiled).toBe("(Math.max(a, b, c) + 1)");
});
