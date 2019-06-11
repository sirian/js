import {Path} from "../../src";

const data: Array<[any, string]> = [
    ["foo", "foo"],
    [3, "3"],
    [undefined, ""],
    [null, ""],
    [Buffer.from("foo"), "foo"],
    [new Uint8Array([102, 111, 111]), "foo"],
];

test.each(data)("Path.stringify(%o) === %o", (path, expected) => {
    expect(Path.stringify(path)).toBe(expected);
});
