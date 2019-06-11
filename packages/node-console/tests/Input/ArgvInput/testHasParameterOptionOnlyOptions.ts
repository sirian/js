import {ArgvInput} from "../../../src";

const data: Array<[string[], string, boolean]> = [
    [["-f", "foo"], "-f", true],
    [["--foo", "--", "foo"], "--foo", true],
    [["--foo=bar", "foo"], "--foo", true],
    [["--", "--foo"], "--foo", false],
];

test.each(data)("ArgvInput(%j).hasParameterOption(%s, true) should be %j", (argv, name, expected) => {
    const input = new ArgvInput(["cli", ...argv]);

    expect(input.hasParameterOption(name, true)).toBe(expected);
});
