import {sprintf} from "../../src";

type TestTuple = [expected: string, format: string, ...args: any[]];

describe("sprintf", () => {
    const pi = Math.PI;

    const testGroup = (description: string, tests: TestTuple[]) => {
        describe(description, () => {
            test.each(tests)("%p === vsprintf(%p, %p)", (expected, format, ...args) => {
                expect(sprintf(format, ...args)).toBe(expected);
            });
        });
    };

    const d: TestTuple[] = [
        ["0", "%d", 0],
        ["0", "%d", -0],
        ["2", "%d", "2"],
        ["NaN", "%d", NaN],
        ["Infinity", "%d", Infinity],
        ["-Infinity", "%d", -Infinity],
        ["2", "%d", 2],
        ["-2", "%d", -2],
        ["+2", "%+d", 2],
        ["-2", "%+d", -2],
        ["-000000123", "%+010d", -123],
        ["______-123", "%+'_10d", -123],
        ["-0002", "%05d", -2],
    ];

    testGroup("%d", d);

    testGroup("%i", d.map(([expected, template, ...args]) => [expected, template.replaceAll("d", "i"), ...args]));

    testGroup("%j", [
        [JSON.stringify({foo: "bar"}), "%j", {foo: "bar"}],
        [JSON.stringify(["foo", "bar"]), "%j", ["foo", "bar"]],
        [JSON.stringify({foo: "bar"}, null, 2), "%2j", {foo: "bar"}],
        [JSON.stringify(["foo", "bar"], null, 2), "%2j", ["foo", "bar"]],
    ]);

    testGroup("%e", [
        ["2e+0", "%e", 2],
        ["1.02e+3", "%.2e", 1024],
        ["1.0e+3", "%.1e", 1024],
        ["1.024e+3", "%.e", 1024],
        ["1.024e+3", "%e", 1024],
    ]);

    testGroup("%u", [
        ["2", "%u", 2],
        ["4294967294", "%u", -2],
        ["1234", "%02u", 1234],
    ]);

    testGroup("%f", [
        ["2.25", "%f", 2.25],
        ["2.25", "%.f", 2.25],
        ["2", "%.0f", 2.25],
        ["2.3", "%.1f", 2.25],
        ["2.25", "%.2f", 2.25],
        ["2.250", "%.3f", 2.25],
        ["NaN", "%.2f", NaN],
        ["Infinity", "%.2f", Infinity],
        ["-Infinity", "%.2f", -Infinity],
        ["2.2", "%f", 2.2],
        ["-2.2", "%f", -2.2],
        ["+2.2", "%+f", 2.2],
        ["-2.2", "%+f", -2.2],
        ["-2.3", "%+.1f", -2.34],
        ["-0.0", "%+.1f", -0.01],
        [" -10.235", "%8.3f", -10.23456],
    ]);

    testGroup("%g", [
        ["3.141592653589793", "%g", pi],
        ["3.14159", "%.6g", pi],
        ["3.14", "%.3g", pi],
        ["3", "%.1g", pi],
    ]);

    testGroup("%b", [
        ["10", "%b", 2],
    ]);

    testGroup("%c", [
        ["A", "%c", 65],
    ]);

    testGroup("%o", [
        ["10", "%o", 8],
        ["37777777770", "%o", -8],
    ]);

    testGroup("", [
        ["%", "%%"],
        ["%s", "%s", "%s"],
        ["xxxxx", "%5.5s", "xxxxxx"],
        ["    x", "%5.1s", "xxxxxx"],
        ["    <", "%5s", "<"],
        ["0000<", "%05s", "<"],
        ["____<", "%'_5s", "<"],
        [">    ", "%-5s", ">"],
        [">0000", "%0-5s", ">"],
        [">____", "%'_-5s", ">"],
        ["xxxxxx", "%5s", "xxxxxx"],
        ["() => \"foobar\"", "%s", () => "foobar"],
    ]);

    const hex: TestTuple[] = [
        ["ff", "%x", 255],
        ["ffffff01", "%x", -255],
    ];

    testGroup("%x", hex);
    testGroup("%X", hex.map(([e, f, ...a]) => [e.toUpperCase(), f.replaceAll("x", "X"), ...a]));

    testGroup("%t", [
        ["true", "%t", true],
        ["t", "%.1t", true],
        ["true", "%t", "true"],
        ["true", "%t", 1],
        ["false", "%t", false],
        ["f", "%.1t", false],
        ["false", "%t", ""],
        ["false", "%t", 0],
    ]);
    testGroup("%T", [
        ["undefined", "%T", undefined],
        ["null", "%T", null],
        ["boolean", "%T", true],
        ["number", "%T", 42],
        ["string", "%T", "This is a string"],
        ["function", "%T", Math.log],
        ["array", "%T", [1, 2, 3]],
        ["object", "%T", {foo: "bar"}],
        ["regexp", "%T", /<('[^']*'|[^'>])*>/],
    ]);

    testGroup("%v", [
        ["true", "%v", true],
        ["42", "%v", 42],
        ["This is a string", "%v", "This is a string"],
        ["1,2,3", "%v", [1, 2, 3]],
        ["[object Object]", "%v", {foo: "bar"}],
        [`/<("[^"]*"|'[^']*'|[^'">])*>/`, "%v", /<("[^"]*"|'[^']*'|[^'">])*>/],
    ]);

    testGroup("", [
        ["-234.34 123.2", "%f %f", -234.34, 123.2],
        ["-12.34 xxx", "%f %s", -12.34, "xxx"],
        ["hi !", "hi %(x.y)s!", {}],
        ["Polly wants a cracker", "%2$s %3$s a %1$s", "cracker", "Polly", "wants"],
        ["Hello world!", "Hello %(who)s!", {who: "world"}],
    ]);
});
