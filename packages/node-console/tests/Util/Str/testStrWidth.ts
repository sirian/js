import {StrUtil} from "../../../src";

const data: Array<[string, number]> = [
    ["", 0],
    ["☃", 1],
    ["1☃1", 3],
];

test.each(data)("StrUtil.width(%o) === %o", (str, expected) => {
    expect(StrUtil.width(str)).toBe(expected);
});
