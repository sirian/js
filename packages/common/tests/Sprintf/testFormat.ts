import {sprintf, vsprintf} from "../../src";

describe("", () => {
    const pi = Math.PI;
    const data: Array<[string, any[]]> = [
        ["%", ["%%"]],
        ["10", ["%b", 2]],
        ["A", ["%c", 65]],
        ["2", ["%d", 2]],
        ["2", ["%i", 2]],
        ["2", ["%d", "2"]],
        ["2", ["%i", "2"]],
        [`{"foo":"bar"}`, ["%j", {foo: "bar"}]],
        [`["foo","bar"]`, ["%j", ["foo", "bar"]]],
        ["2e+0", ["%e", 2]],
        ["2", ["%u", 2]],
        ["4294967294", ["%u", -2]],
        ["2.2", ["%f", 2.2]],
        ["3.141592653589793", ["%g", pi]],
        ["10", ["%o", 8]],
        ["37777777770", ["%o", -8]],
        ["%s", ["%s", "%s"]],
        ["ff", ["%x", 255]],
        ["ffffff01", ["%x", -255]],
        ["FF", ["%X", 255]],
        ["FFFFFF01", ["%X", -255]],
        ["Polly wants a cracker", ["%2$s %3$s a %1$s", "cracker", "Polly", "wants"]],
        ["Hello world!", ["Hello %(who)s!", {who: "world"}]],
        ["true", ["%t", true]],
        ["t", ["%.1t", true]],
        ["true", ["%t", "true"]],
        ["true", ["%t", 1]],
        ["false", ["%t", false]],
        ["f", ["%.1t", false]],
        ["false", ["%t", ""]],
        ["false", ["%t", 0]],

        ["undefined", ["%T", undefined]],
        ["null", ["%T", null]],
        ["boolean", ["%T", true]],
        ["number", ["%T", 42]],
        ["string", ["%T", "This is a string"]],
        ["function", ["%T", Math.log]],
        ["array", ["%T", [1, 2, 3]]],
        ["object", ["%T", {foo: "bar"}]],
        ["regexp", ["%T", /<('[^']*'|[^'>])*>/]],

        ["true", ["%v", true]],
        ["42", ["%v", 42]],
        ["This is a string", ["%v", "This is a string"]],
        ["1,2,3", ["%v", [1, 2, 3]]],
        ["[object Object]", ["%v", {foo: "bar"}]],
        ["/<(\"[^\"]*\"|'[^']*'|[^'\">])*>/", ["%v", /<("[^"]*"|'[^']*'|[^'">])*>/]],

        ["2", ["%d", 2]],
        ["-2", ["%d", -2]],
        ["+2", ["%+d", 2]],
        ["-2", ["%+d", -2]],
        ["2", ["%i", 2]],
        ["-2", ["%i", -2]],
        ["+2", ["%+i", 2]],
        ["-2", ["%+i", -2]],
        ["2.2", ["%f", 2.2]],
        ["-2.2", ["%f", -2.2]],
        ["+2.2", ["%+f", 2.2]],
        ["-2.2", ["%+f", -2.2]],
        ["-2.3", ["%+.1f", -2.34]],
        ["-0.0", ["%+.1f", -0.01]],
        ["3.14159", ["%.6g", pi]],
        ["3.14", ["%.3g", pi]],
        ["3", ["%.1g", pi]],
        ["-000000123", ["%+010d", -123]],
        ["______-123", ["%+'_10d", -123]],
        ["-234.34 123.2", ["%f %f", -234.34, 123.2]],

        // padding
        ["-0002", ["%05d", -2]],
        ["-0002", ["%05i", -2]],
        ["    <", ["%5s", "<"]],
        ["0000<", ["%05s", "<"]],
        ["____<", ["%'_5s", "<"]],
        [">    ", ["%-5s", ">"]],
        [">0000", ["%0-5s", ">"]],
        [">____", ["%'_-5s", ">"]],
        ["xxxxxx", ["%5s", "xxxxxx"]],
        ["1234", ["%02u", 1234]],
        [" -10.235", ["%8.3f", -10.23456]],
        ["-12.34 xxx", ["%f %s", -12.34, "xxx"]],
        [`{\n  "foo": "bar"\n}`, ["%2j", {foo: "bar"}]],
        [`[\n  "foo",\n  "bar"\n]`, ["%2j", ["foo", "bar"]]],

        // precision
        ["2.3", ["%.1f", 2.345]],
        ["xxxxx", ["%5.5s", "xxxxxx"]],
        ["    x", ["%5.1s", "xxxxxx"]],

        ["foobar", ["%s", () => "foobar"]],
    ];

    test.each(data)("%p === Sprintf.format(%p)", (expected, argv) => {
        const [format, ...args] = argv;
        expect(sprintf(format, ...args)).toBe(expected);
        expect(vsprintf(format, args)).toBe(expected);
    });
});