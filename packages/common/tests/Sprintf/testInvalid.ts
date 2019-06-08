import {sprintf, vsprintf} from "../../src";

function throws(format: string, args: any, err?: any) {
    expect(() => vsprintf(format, args)).toThrow(err);
    expect(() => sprintf(format, ...args)).toThrow(err);
}

function notThrow(format: string, args: any, err?: any) {
    expect(() => vsprintf(format, args)).not.toThrow(err);
    expect(() => sprintf(format, ...args)).not.toThrow(err);
}

describe("sprintfjs cache", () => {
    test("should not throw Error (cache consistency)", () => {
        // redefine object properties to ensure that is not affect to the cache
        sprintf("hasOwnProperty");
        sprintf("constructor");
        notThrow("%s", ["caching..."]);
        notThrow("%s", ["crash?"]);
    });
});

describe("sprintfjs", () => {

    test("should throw SyntaxError for placeholders", () => {
        throws("%", [], SyntaxError);
        throws("%A", [], SyntaxError);
        throws("%s%", [], SyntaxError);
        throws("%(s", [], SyntaxError);
        throws("%)s", [], SyntaxError);
        throws("%$s", [], SyntaxError);
        throws("%()s", [], SyntaxError);
        throws("%(12)s", [], SyntaxError);
    });

    const numeric = "bcdiefguxX".split("");
    for (const specifier of numeric) {
        const fmt = sprintf("%%%s", specifier);

        test(fmt + " should throw TypeError for invalid numbers", () => {
            throws(fmt, [], TypeError);
            throws(fmt, ["str"], TypeError);
            throws(fmt, [{}], TypeError);
            throws(fmt, ["s"], TypeError);
        });

        test(fmt + " should not throw TypeError for something implicitly castable to number", () => {
            notThrow(fmt, [1 / 0]);
            notThrow(fmt, [true]);
            notThrow(fmt, [[1]]);
            notThrow(fmt, ["200"]);
            notThrow(fmt, [null]);
        });
    }

    test("should not throw Error for expression which evaluates to undefined", () => {
        notThrow("%(x.y)s", [{x: {}}]);
    });

    test("should throw own Error when expression evaluation would raise TypeError", () => {
        const fmt = "%(x.y)s";
        try {
            sprintf(fmt, [{}]);
        } catch (e) {
            expect(e.message.includes("[sprintf]")).toBe(true);
        }
    });

    test("should not throw when accessing properties on the prototype", () => {
        class C {
            get x() { return 2; }

            set y(v: any) { /*Noop */}
        }

        const c = new C();
        notThrow("%(x)s", [c]);
        notThrow("%(y)s", [c]);
    });
});
