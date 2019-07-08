import {Proc, StringInput} from "../../../src";

const data = [
    ["-f foo", "-f foo"],
    [`-f --bar=foo "a b c d"`, `-f --bar=foo ` + Proc.escapeArg("a b c d")],
];

test.each(data)("casting to string StringInput(%o) === %o", (argv, expected) => {
    const input = new StringInput(argv);

    expect("" + input).toBe(expected);
});
