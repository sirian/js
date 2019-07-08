import {ArgvInput, FlagOption, InputDefinition, Option} from "../../../src";

const data: Array<[string[], Option[], any]> = [
    [
        ["--name=foo", "--name=bar", "--name=baz"],
        [new Option("name", {valueRequired: false, multiple: true})],
        {name: ["foo", "bar", "baz"]},
    ],

    [
        ["--name", "foo", "--name", "bar", "--name", "baz"],
        [new Option("name", {valueRequired: false, multiple: true})],
        {name: ["foo", "bar", "baz"]},
    ],

    [
        ["--name=foo", "--name=bar", "--name="],
        [new Option("name", {valueRequired: false, multiple: true})],
        {name: ["foo", "bar", ""]},
    ],

    [
        ["--name", "foo", "--name", "bar", "--name", "--anotherOption"],
        [new Option("name", {valueRequired: false, multiple: true}), new FlagOption("anotherOption")],
        {name: ["foo", "bar", undefined], anotherOption: true},
    ],
];

test.only.each(data)("Parse array option %s", (argv, def, expected) => {
    const input = new ArgvInput(["cli", ...argv]);
    input.bind(new InputDefinition(def));

    expect(input.getOptions()).toEqual(expected);
});
