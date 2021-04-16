// tslint:disable:no-eval

import {stringifyTagString} from "../src";

const data = [
    "``",
    "`${null}`",
    "`${undefined}`",
    "`${1} ${2}`",
    "`${1}${2}`",
    "`x${1}y${2}z`",
    "`x${1}y${2}`",
    "`${1}y${2}`",

    "`foo\n  bar`",
    "`${[1, 2]}\n${{x: 1}}`",

    "`foo\n${123}\nbar`",
].map((expr) => [expr, eval(expr)] as [string, string]);

test.each(data)("stringifyTagString(%o) === %o", (expr, expected) => {
    const fn = stringifyTagString;
    expect(eval("fn" + expr)).toBe(expected);
});
