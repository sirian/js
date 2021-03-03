import {parsePropertyPath} from "../../src/PropertyPath";

const data: Array<[string, Array<string | number>]> = [
    ["x", ["x"]],
    ["x.y", ["x", "y"]],
    ["foo.bar.baz", ["foo", "bar", "baz"]],
    ["x[y]", ["x", "y"]],
    ["[x]", ["x"]],
    ["[x][y]", ["x", "y"]],
    ["[x].y", ["x", "y"]],
    ["foo.bar[0].baz", ["foo", "bar", 0, "baz"]],
    ["foo.bar[zoo].0", ["foo", "bar", "zoo", "0"]],
    ["foo.bar[zoo.xy].0", ["foo", "bar", "zoo.xy", "0"]],
];

test.each(data)("PropertyPath.from(%p).parts === %p", (path, expected) => {
    const p = parsePropertyPath(path);
    expect(p.map((v) => v[0])).toStrictEqual(expected);
    expect(p.length).toBe(expected.length);
});
