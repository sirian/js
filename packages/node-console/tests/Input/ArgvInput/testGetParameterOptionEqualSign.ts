import {ArgvInput} from "../../../src";

const data: Array<[string[], string | string[], boolean, any]> = [
    [["foo:bar", "-e", "dev"], "-e", false, "dev"],
    [["foo:bar", "--env=dev"], "--env", false, "dev"],
    [["foo:bar", "-e", "dev"], ["-e", "--env"], false, "dev"],
    [["foo:bar", "--env=dev"], ["-e", "--env"], false, "dev"],
    [["foo:bar", "--env=dev", "--en=1"], ["--en"], false, "1"],
    [["foo:bar", "--env=dev", "", "--en=1"], ["--en"], false, "1"],
    [["foo:bar", "--env", "val"], "--env", false, "val"],
    [["foo:bar", "--env", "val", "--dummy"], "--env", false, "val"],
    [["foo:bar", "--", "--env=dev"], "--env", false, "dev"],
    [["foo:bar", "--", "--env=dev"], "--env", true, false],
];
test.each(data)("ArgvInput(%j).hasParameterOption(%s, %j) should be %j", (argv, key, onlyParams, expected) => {
    const input = new ArgvInput(["cli", ...argv]);
    expect(input.getParameterOption(key, false, onlyParams)).toEqual(expected);
});
