import {Argument, ArgvInput, InputDefinition, Option} from "../../../src";

test("", () => {
    const input = new ArgvInput(["cli", "-f", "bar", ""]);
    input.bind(
        new InputDefinition([
            new Argument({name: "empty"}),
            new Option({name: "foo", shortcut: "f", valueRequired: false}),
        ]),
    );

    expect(input.getArguments()).toEqual({empty: ""});
});
