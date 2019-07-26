import {TagString} from "../../src";

function raw(strings: TemplateStringsArray, ...values: any[]): [TemplateStringsArray, any[]] {
    return [strings, values];
}

const data = [
    raw``,
    raw`${Symbol.iterator}`,
    raw`${null}`,
    raw`${undefined}`,
    raw`${1} ${2}`,
    raw`${1}${2}`,

    raw`foo
    bar`,
    raw`${[1, 2]}\n${{x: 1}}`,

    raw`foo
    ${123}
    bar`,
];

test.each(data)("TagString(%O, %O).compile", (strings: TemplateStringsArray, values: any[]) => {
    const expected = strings.reduce((res, str, i) => [res, values[i - 1], str].map(String).join(""));
    expect(TagString.from(strings, values).toString()).toBe(expected);
});

const data2 = [
    ["foo", "foo"],
    [["foo", "bar"], "fooundefinedbar"],
];

test.each(data2)("TagString(%j, []) === %j", (strings, expected) => {
    expect(TagString.from(strings, []).toString()).toBe(expected);
});
