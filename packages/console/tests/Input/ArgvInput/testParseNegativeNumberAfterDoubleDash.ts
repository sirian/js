import {Argument, ArgvInput, InputDefinition, Option} from "../../../src";

test("", () => {
    const input = new ArgvInput(["cli", "--", "-1"]);
    input.bind(new InputDefinition([new Argument({name: "number"})]));
    expect(input.getArguments()).toEqual({number: "-1"});
});

test("", () => {
    const input = new ArgvInput(["cli", "-f", "bar", "--", "-1"]);
    input.bind(new InputDefinition([new Argument({name: "number"}), new Option({name: "foo", shortcut: "f"})]));
    expect(input.getOptions()).toEqual({foo: "bar"});
    expect(input.getArguments()).toEqual({number: "-1"});
});
