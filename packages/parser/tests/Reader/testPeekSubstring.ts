import {Reader} from "../../src";

const data: Array<[string, number, string]> = [
    ["", 3, ""],
    ["foo", 0, ""],
    ["foo", 2, "fo"],
    ["foo", 4, "foo"],
];

test.each(data)("new Reader(%o).peekSubstring(%o) == %o", (line, length, expected) => {
    const reader = new Reader(line);
    const str = reader.peekSubstring(length);
    expect(str).toBe(expected);
    expect(reader.position).toBe(Math.min(length, line.length));
});
