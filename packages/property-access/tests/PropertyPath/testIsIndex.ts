import {PropertyPath} from "../../src";

const data: Array<[string, number, boolean]> = [
    ["foo", 0, false],
    ["foo[0]", 0, false],
    ["foo[0]", 1, true],
    ["foo.0", 1, false],
    ["0", 0, false],
    ["[0]", 0, true],
    ["[5][6]", 0, true],
    ["[5][6]", 1, true],
    ["[5].6", 0, true],
    ["[5].6", 1, false],
];

test.each(data)("new PropertyPath(%p).isIndex(%d) === %p", (path, index, expected) => {
    const p = new PropertyPath(path);
    expect(p.getPart(index).isIndex).toBe(expected);
});
