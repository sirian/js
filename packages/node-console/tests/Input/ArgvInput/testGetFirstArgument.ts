import {ArgvInput} from "../../../src";

const data: Array<[string[], any]> = [[["-fbbar"], undefined], [["-fbbar", "foo"], "foo"]];

test.each(data)("", (argv, expected) => {
    const input = new ArgvInput(["cli", ...argv]);
    expect(input.getFirstArgument()).toBe(expected);
});
