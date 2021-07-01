import {Parser, PlaceholderToken} from "../../src";

const p = (type: string, opts = "") => new PlaceholderToken(void 0, type, opts, "%" + opts + type);
const t = (...args: any[]) => Reflect.construct(PlaceholderToken, args);

const data: Array<[string, string[]]> = [
    ["", [""]],
    ["foo", ["foo"]],
    ["foo%s", ["foo", p("s")]],
    ["foo%s%d", ["foo", p("s"), p("d")]],
    ["foo%02s%.2f", ["foo", p("s", "02"), p("f", ".2")]],
    ["foo%02s%.2fs", ["foo", p("s", "02"), p("f", ".2"), "s"]],

    ["{foo}", [t("foo", void 0, "", "{foo}")]],
    ["{foo|s}", [t("foo", "s", "", "{foo|s}")]],
    ["{foo%s}", [t("foo", "s", "", "{foo%s}")]],
    ["{foo|d}", [t("foo", "d", "", "{foo|d}")]],
    ["{foo%2.3f}", [t("foo", "f", "2.3", "{foo%2.3f}")]],
    ["Hi{foo|date:yyyy-mm}z", ["Hi", t("foo", "date", "yyyy-mm", "{foo|date:yyyy-mm}"), "z"]],
];

test.each(data)("parser.parse(%p) === %p", (line, expected) => {
    const parser = new Parser();
    const parsed = parser.parse(line);

    expect(parsed).toStrictEqual(expected);
});
