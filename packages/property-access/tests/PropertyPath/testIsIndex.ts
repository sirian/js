import {parsePropertyPath} from "../../src/PropertyPath";

const data: Array<[string, boolean[]]> = [
    ["foo", [false]],
    ["foo[0]", [false, true]],
    ["foo.0", [false, false]],
    ["0", [false]],
    ["[0]", [true]],
    ["[5][6]", [true, true]],
    ["[5].6", [true, false]],
    ["5[6]", [false, true]],
    ["5.6", [false, false]],
];

test.each(data)("new PropertyPath(%p) indexes is %o", (path, expected) => {
    const p = parsePropertyPath(path);
    for (const [i, element] of expected.entries()) {
        expect(p[i][1]).toBe(element);
    }
});
