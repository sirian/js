import {ArgvInput, Proc} from "../../../src";

test("ArgvInput.testToString", () => {
    let input = new ArgvInput(["cli", "-f", "foo"]);
    expect(String(input)).toEqual("-f foo");

    input = new ArgvInput(["cli", "-f", "--bar=foo", "a b c d", "A\nB'C"]);
    const expected = "-f --bar=foo " + Proc.escapeArg("a b c d") + " " + Proc.escapeArg("A\nB'C");

    expect(String(input)).toEqual(expected);
});
