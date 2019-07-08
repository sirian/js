import {Argument, ArgvInput, FlagOption, InputDefinition, Option} from "../../../src";

const data: Array<[string, string[], Array<Option | Argument>, any]> = [
    ["->parse() parses long options without a value", ["--foo"], [new FlagOption({name: "foo"})], {foo: true}],
    [
        "->parse() parses long options with a required value (with a = separator)",
        ["--foo=bar"],
        [new Option({name: "foo", shortcut: "f", valueRequired: true})],
        {foo: "bar"},
    ],
    [
        "->parse() parses long options with a required value (with a space separator)",
        ["--foo", "bar"],
        [new Option({name: "foo", shortcut: "f", valueRequired: true})],
        {foo: "bar"},
    ],
    [
        "->parse() parses long options with optional value which is empty (with a = separator) as empty string",
        ["--foo="],
        [new Option({name: "foo", shortcut: "f", valueRequired: false})],
        {foo: ""},
    ],
    [
        "->parse() parses long options with optional value without value specified" +
        " or an empty string (with a = separator) followed by an argument as empty string",
        ["--foo=", "bar"],
        [new Option({name: "foo", shortcut: "f", valueRequired: false}), new Argument({name: "name", required: true})],
        {foo: ""},
    ],
    [
        "->parse() parses long options with optional value which is empty (with a = separator) preceded by an argument",
        ["bar", "--foo"],
        [new Option({name: "foo", shortcut: "f", valueRequired: false}), new Argument({name: "name", required: true})],
        {foo: undefined},
    ],
    [
        "->parse() parses long options with optional value which is empty as empty string even followed by an argument",
        ["--foo", "", "bar"],
        [new Option({name: "foo", shortcut: "f", valueRequired: false}), new Argument({name: "name", required: true})],
        {foo: ""},
    ],
    [
        "->parse() parses long options with optional value specified with no separator and no value as undefined",
        ["--foo"],
        [new Option({name: "foo", shortcut: "f", valueRequired: false})],
        {foo: undefined},
    ],
    [
        "->parse() parses short options without a value",
        ["-f"],
        [new FlagOption({name: "foo", shortcut: "f"})],
        {foo: true},
    ],
    [
        "->parse() parses short options with a required value (with no separator)",
        ["-fbar"],
        [new Option({name: "foo", shortcut: "f", valueRequired: true})],
        {foo: "bar"},
    ],
    [
        "->parse() parses short options with a required value (with a space separator)",
        ["-f", "bar"],
        [new Option({name: "foo", shortcut: "f", valueRequired: true})],
        {foo: "bar"},
    ],
    [
        "->parse() parses short options with an optional empty value",
        ["-f", ""],
        [new Option({name: "foo", shortcut: "f", valueRequired: false})],
        {foo: ""},
    ],
    [
        "->parse() parses short options with an optional empty value followed by an argument",
        ["-f", "", "foo"],
        [new Argument({name: "name"}), new Option({name: "foo", shortcut: "f", valueRequired: false})],
        {foo: ""},
    ],
    [
        "->parse() parses short options with an optional empty value followed by an option",
        ["-f", "", "-b"],
        [new Option({name: "foo", shortcut: "f", valueRequired: false}), new FlagOption({name: "bar", shortcut: "b"})],
        {foo: "", bar: true},
    ],
    [
        "->parse() parses short options with an optional value which is not present",
        ["-f", "-b", "foo"],
        [
            new Argument({name: "name"}),
            new Option({name: "foo", shortcut: "f", valueRequired: false}),
            new FlagOption({name: "bar", shortcut: "b"}),
        ],
        {foo: undefined, bar: true},
    ],
    [
        "->parse() parses short options when they are aggregated as a single one",
        ["-fb"],
        [new FlagOption({name: "foo", shortcut: "f"}), new FlagOption({name: "bar", shortcut: "b"})],
        {foo: true, bar: true},
    ],
    [
        "->parse() parses short options when they are aggregated as a single one" +
        " and the last one has a required value",
        ["-fb", "bar"],
        [new FlagOption({name: "foo", shortcut: "f"}), new Option({name: "bar", shortcut: "b", valueRequired: true})],
        {foo: true, bar: "bar"},
    ],
    [
        "->parse() parses short options when they are aggregated as a single one" +
        " and the last one has an optional value",
        ["-fb", "bar"],
        [new FlagOption({name: "foo", shortcut: "f"}), new Option({name: "bar", shortcut: "b", valueRequired: false})],
        {foo: true, bar: "bar"},
    ],
    [
        "->parse() parses short options when they are aggregated as a single one" +
        " and the last one has an optional value with no separator",
        ["-fbbar"],
        [new FlagOption({name: "foo", shortcut: "f"}), new Option({name: "bar", shortcut: "b", valueRequired: false})],
        {foo: true, bar: "bar"},
    ],
    [
        "->parse() parses short options when they are aggregated as a single one and one of them takes a value",
        ["-fbbar"],
        [
            new Option({name: "foo", shortcut: "f", valueRequired: false}),
            new Option({name: "bar", shortcut: "b", valueRequired: false}),
        ],
        {foo: "bbar", bar: undefined},
    ],
];

test.each(data)("%s %j", (message, args, def, expected) => {
    const input = new ArgvInput(["cli", ...args]);
    input.bind(new InputDefinition(def));
    expect(input.getOptions()).toEqual(expected);
});

const data2: Array<[string[], string | undefined]> = [
    [["--verbose"], "1"],
    [["--verbose="], ""],
    [["--verbose", "''"], "''"],
    [["--verbose=2"], "2"],
    [["--verbose", "2"], "2"],
    [["-v", "2"], "2"],
    [["-v", "''"], "''"],
    [["-v2"], "2"],
    [["-v"], "1"],
    [[], undefined],
];

test.each(data2)("InputArgv(%j).getOption('verbose') should be %j", (args, expected) => {
    const input = new ArgvInput(["cli", ...args]);

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
