import {entriesOf, fromEntries} from "../../src";

describe("", () => {
    const data: any[] = [
        {},
        {x: 1},
        {x: 1, y: 2},
    ].map((obj) => [entriesOf(obj), obj]);

    test.each(data)("Obj.fromEntries(%j) === %j", (entries, expected) => {
        expect(fromEntries(entries)).toStrictEqual(expected);
    });
});
