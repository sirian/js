import {isNumber} from "@sirian/common";
import {parsePropertyPath, Path, PathElement} from "../../src/PropertyPath";

describe("PropertyPath.parse", () => {
    function f(key: number | string, asIndex: boolean = isNumber(key)): PathElement {
        return [key, asIndex];
    }

    const data: Array<[Path, PathElement[]]> = [
        [0, [f(0)]],
        ["0", [f("0")]],
        [1.2, [f(1.2)]],
        ["1.2", [f("1"), f("2")]],
        ["1.2", [f("1"), f("2")]],
        ["foo", [f("foo")]],
        ["foo.0", [f("foo"), f("0")]],
        ["foo[0]", [f("foo"), f(0)]],
        ["foo.bar", [f("foo"), f("bar")]],
        ["foo.bar[zoo]", [f("foo"), f("bar"), f("zoo", true)]],
        [[0, "1", "1.2", 1.2], [f(0), f("1"), f("1.2"), f(1.2)]],
        [["foo.bar", "[zoo]"], [f("foo.bar"), f("[zoo]")]],
        [["foo.bar[zoo]", "[zoo]"], [f("foo.bar[zoo]"), f("[zoo]")]],
    ];

    test.each(data)("PropertyPath.parse(%o) === %O", (value, expected) => {
        expect(parsePropertyPath(value)).toStrictEqual(expected);
    });
});
