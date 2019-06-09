import {InputDefinition, Option, StringInput} from "../../../src";

test("testInputOptionWithGivenString", () => {
    const definition = new InputDefinition({
        options: {
            foo: new Option({
                valueRequired: true,
            }),
        },
    });

    // call to bind
    const input = new StringInput("--foo=bar");
    input.bind(definition);

    expect(input.getOption("foo")).toEqual("bar");
});
