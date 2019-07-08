import {Argument, ArgvInput, FlagOption, InputDefinition, Option} from "../../../src";

const data: Array<[string, string[], InputDefinition]> = [
    [
        "The \"--foo\" option requires a value.",
        ["--foo"],
        new InputDefinition([new Option({name: "foo", valueRequired: true})]),
    ],
    [
        "The \"-f\" option does not exist.",
        ["-ffoo"],
        new InputDefinition([new Option({name: "foo", valueRequired: true})]),
    ],
    [
        "The \"--foo\" option does not accept a value.",
        ["--foo=bar"],
        new InputDefinition([new FlagOption({name: "foo"})]),
    ],
    ["No arguments expected, got \"foo\".", ["foo", "bar"], new InputDefinition()],
    [
        "Too many arguments, expected arguments \"number\".",
        ["foo", "bar"],
        new InputDefinition([new Argument({name: "number"})]),
    ],
    [
        "Too many arguments, expected arguments \"number\" \"county\".",
        ["foo", "bar", "zzz"],
        new InputDefinition([new Argument({name: "number"}), new Argument({name: "county"})]),
    ],
    ["The \"--foo\" option does not exist.", ["--foo"], new InputDefinition()],
    ["The \"-f\" option does not exist.", ["-f"], new InputDefinition()],
    ["The \"-1\" option does not exist.", ["-1"], new InputDefinition([new Argument({name: "number"})])],
];

test.each(data)("%s", (message, argv, definition) => {
    expect(() => {
        const input = new ArgvInput(["cli", ...argv]);
        input.bind(definition);
    }).toThrow(message);
});
