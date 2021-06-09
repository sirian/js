import {entriesOf, XMap} from "../../src";

describe("new XMap()", () => {
    const obj = {
        x: 1,
        y: 2,
    };
    const entries = entriesOf(obj);

    const data = [
        [["x", 1], ["y", 2]],
        {x: 1, y: 2},
        new Map(entries),
    ] as const;

    test.each(data)("new XMap(%o)", (v) => {
        expect([...new XMap(v)]).toStrictEqual(entries);
    });
});
