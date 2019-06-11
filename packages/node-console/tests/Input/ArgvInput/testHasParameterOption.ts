import {ArgvInput} from "../../../src";

const data: Array<[string[], string, boolean]> = [
    [["-f", "foo"], "-f", true],
    [["-etest"], "-e", true],
    [["-etest"], "-s", false],
    [["--foo", "foo"], "--foo", true],
    [["foo"], "--foo", false],
    [["--foo=bar"], "--foo", true],
];

test.each(data)("ArgvInput(%j).hasParameterOption(%s) should be %j", (argv, name, expected) => {
    const input = new ArgvInput(["cli", ...argv]);
    expect(input.hasParameterOption(name)).toEqual(expected);
});
