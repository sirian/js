import {sprintf} from "../../src";

function throws(format: string, args: any, err: any) {
    test(format, () => {
        expect(() => sprintf(format, ...args)).toThrow(err);
    });
}

function notThrow(format: string, args: any, err?: any) {
    test(format, () => {
        expect(() => sprintf(format, ...args)).not.toThrow(err);
    });
}

const UNKNOWN_PLACEHOLDER = "Unknown format specifier";
const UNEXPECTED_TOKEN = "Unexpected token";
const NOT_ENOUGH_ARGS = "Argument '1' not provided";
const FAILED_TO_PARSE_KEY = "Failed to parse named argument key";

describe("sprintf", () => {
    describe("should throw when not enough args", () => {
        notThrow("%s %d", [1, 2, 3]);
        notThrow("%s %d", [1, 2]);
        throws("%s %d", [1], NOT_ENOUGH_ARGS);
    });

    describe("should not throw Error (cache consistency)", () => {
        // redefine object properties to ensure that is not affect to the cache
        sprintf("hasOwnProperty");
        sprintf("constructor");
        notThrow("%s", ["caching..."]);
        notThrow("%s", ["crash?"]);
    });

    describe("should throw SyntaxError for placeholders", () => {
        throws("%", [], UNEXPECTED_TOKEN);
        throws("%s%", [], UNEXPECTED_TOKEN);
        throws("%(s", [], UNEXPECTED_TOKEN);
        throws("%)s", [], UNEXPECTED_TOKEN);
        throws("%$s", [], UNEXPECTED_TOKEN);
        throws("%()s", [], UNEXPECTED_TOKEN);
        throws("%(12)s", [], FAILED_TO_PARSE_KEY);
        throws("%A", [], UNKNOWN_PLACEHOLDER);
        throws("%Z", [], UNKNOWN_PLACEHOLDER);
    });

    const numeric = "bcdiefguxX".split("");
    for (const specifier of numeric) {
        const fmt = sprintf("%%%s", specifier);

        describe(fmt + " should not throw TypeError for something implicitly castable to number", () => {
            notThrow(fmt, [1 / 0]);
            notThrow(fmt, [true]);
            notThrow(fmt, [[1]]);
            notThrow(fmt, ["200"]);
            notThrow(fmt, [null]);
        });
    }

    describe("should not throw Error for expression which evaluates to undefined", () => {
        notThrow("%(x.y)s", [{x: {}}]);
    });

    describe("should not throw when accessing properties on the prototype", () => {
        class C {
            get x() { return 2; }

            set y(v: any) { /*Noop */}
        }

        const c = new C();
        notThrow("%(x)s", [c]);
        notThrow("%(y)s", [c]);
    });
});
