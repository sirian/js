import {ConsoleFormatter, LogRecord} from "../../../src";

const data: Array<[any[], any[]]> = [
    [["%s", "foo"], ["%s", "foo"]],
    [[1], ["", 1]],
    [["%o", 1], ["%o", 1]],
    [["%d", 1], ["%s", "1"]],
    [["%04d", 1], ["%s", "0001"]],
    [["", 1], ["", 1]],
    [[1, 2, 3], ["", 1, 2, 3]],
    [[1, [3, 4], {}], ["", 1, [3, 4], {}]],
    [["", 1, [3, 4], {}], ["", 1, [3, 4], {}]],
    [["%o %s %s", 1, [3, 4], {}], ["%o %s %s", 1, "3,4", "[object Object]"]],
    [["Hello {foo} {foo%.2f}", {foo: 1.8}], ["Hello %o %s", 1.8, "1.80"]],
    [["Hello %02d", "0xFF", 17.00001], ["Hello %s", "255", 17.00001]],
    [["Hello <info>%02d</info>", "0xFF", 17.00001], ["Hello %s", "255", 17.00001]],
    [["Hello {x|d} {y|f:.2}", {x: 1.7, y: 1 / 3}], ["Hello %s %s", "1", "0.33"]],
];

test.each(data)("ConsoleFormatter.format(%p) === %p", (args: any, expected: any) => {
    const formatter = new ConsoleFormatter({
        lineFormat: "{channel|s}.{level|s} {message}",
    });

    const r = new LogRecord({
        channel: "test",
        args,
    });

    const result = formatter.format(r);

    expect(result.getFormatted()).toStrictEqual([`%s.%s ${expected[0]}`, "test", "INFO", ...expected.slice(1)]);
});
