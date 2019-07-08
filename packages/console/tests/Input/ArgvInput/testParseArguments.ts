import {Argument, ArgvInput, InputDefinition} from "../../../src";

test("ArgvInput.parseArguments", () => {
    const input = new ArgvInput(["cli", "foo"]);
    input.bind(new InputDefinition([new Argument("name")]));

    expect(input.getArgument("name")).toEqual("foo");
    expect(input.getArguments()).toEqual({name: "foo"});
});
