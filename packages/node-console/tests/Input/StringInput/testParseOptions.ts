import {Argument, InputDefinition, Option, StringInput} from "../../../src";

const data: Array<[string, string | undefined]> = [
    ["--verbose", "1"],
    [`--verbose ""`, ""],
    [`--verbose ''`, ""],
    ["--verbose 2", "2"],
    [`--verbose= foo`, ""],
    ["--verbose=", ""],
    ["--verbose=2", "2"],

    ["-v 2", "2"],
    [`-v ""`, ""],
    [`-v ''`, ""],
    ["-v2", "2"],
    ["-v", "1"],
    ["", undefined],
];

test.each(data)("%j", (str, expected) => {
    const input = new StringInput(str);
    input.bind(
        new InputDefinition([
            new Option({
                name: "verbose",
                shortcut: "v",
                defaultValue: "1",
            }),
            new Argument({
                name: "name",
                required: false,
            }),
        ]),
    );

    expect(input.getOption("verbose")).toEqual(expected);
});
