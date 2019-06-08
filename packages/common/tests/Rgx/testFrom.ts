import {Rgx} from "../../src";

describe("", () => {
    const data: Array<[RegExp | string, object, RegExp]> = [
        ["foo", {flags: "g"}, /foo/g],
        [/foo/, {flags: "g"}, /foo/g],
        [/foo/i, {flags: "g"}, /foo/g],
        [/foo/i, {flags: "s", addFlags: "g"}, /foo/sg],
        [/foo/ig, {flags: "s", addFlags: "g"}, /foo/sg],
        [/foo/ig, {addFlags: "g"}, /foo/ig],
        [/foo/ig, {addFlags: "ig"}, /foo/ig],
        [/foo/, {addFlags: "ig"}, /foo/ig],
    ];

    test.each(data)("Rgx.create(%p, %o) === %s", (source, options, expected) => {
        expect(Rgx.create(source, options)).toEqual(expected);
    });
});
