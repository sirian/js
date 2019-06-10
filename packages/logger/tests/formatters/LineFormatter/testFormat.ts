import {LineFormatter, LogRecord} from "../../../src";

const data: Array<[any[], string]> = [
    [[1], "1"],
    [["1"], "1"],
    [["", 1], " 1"],
    [["%s", "foo"], "foo"],
    [[1, 2, 3], "1 2 3"],
    [[1, [3, 4], {}], "1 [3, 4] {}"],
    [["", 1, [3, 4], {}], ` 1 [3, 4] {}`],
    [["%o %s %s", 1, [3, 4], {}], "1 3,4 [object Object]"],
    [["Hello %02d %.2f", 1.8, Math.PI], "Hello 01 3.14"],
    [["Hello %02d", "0xFF", 17.00001], "Hello 255 17.00001"],
    [["Hello <info>%02d</info>", "0xFF", 17.00001], "Hello 255 17.00001"],
    [["Hello {x|d} {y|f:.2}", {x: 1.7, y: 1 / 3}], "Hello 1 0.33"],
];

test.each(data)("lineFormatter format %p", (args, expected) => {
    const formatter = new LineFormatter({
        lineFormat: "{channel|s}.{level|s} {message}",
    });
    const r = new LogRecord({
        channel: "test",
        args,
    });
    const ctx = formatter.format(r);

    expect(ctx.toString()).toBe(`test.INFO ${expected}`);
});
