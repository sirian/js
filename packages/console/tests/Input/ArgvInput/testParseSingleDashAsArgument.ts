import {Argument, ArgvInput, InputDefinition} from "../../../src";

test("ArgvInput.testParseSingleDashAsArgument", () => {
    const input = new ArgvInput(["cli", "-"]);
    input.bind(new InputDefinition([new Argument({name: "file"})]));

    expect(input.getArguments()).toEqual({file: "-"});
});
