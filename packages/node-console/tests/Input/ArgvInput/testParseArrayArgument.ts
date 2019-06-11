import {Argument, ArgvInput, InputDefinition} from "../../../src";

test("", () => {
    const input = new ArgvInput(["cli", "foo", "bar", "baz", "bat"]);
    input.bind(new InputDefinition([new Argument("arg", {multiple: true})]));

    expect(input.getArguments()).toEqual({arg: ["foo", "bar", "baz", "bat"]});
});
