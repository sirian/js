import {Option} from "../../../src";

const data: Array<[any[], string, string[]]> = [
    [["foo"], "foo", []],
    [["foo", "f"], "foo", ["f"]],
    [["foo", "f", {name: "bar"}], "bar", ["f"]],
    [["foo", {name: "bar"}], "bar", []],
    [[{name: "foo", shortcut: "f"}], "foo", ["f"]],
    [[{name: "foo", shortcut: ["f", "b"]}], "foo", ["f", "b"]],
    [[{name: "foo", shortcut: "f|b"}], "foo", ["f", "b"]],
];

test.each(data)("%j", (args: any[], expectedName: string, expectedShortcuts: string[]) => {
    const o = new Option(...args);
    expect(o.getName()).toEqual(expectedName);
    expect(o.getShortcuts()).toEqual(expectedShortcuts);
});
