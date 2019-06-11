import {Obj} from "../../src";

describe("", () => {
    const data: any[] = [
        {},
        {x: 1},
        {x: 1, y: 2},
    ].map((obj) => [Obj.entries(obj), obj]);

    test.each(data)("Obj.fromEntries(%j) === %j", (entries, expected) => {
        expect(Obj.fromEntries(entries)).toStrictEqual(expected);
    });
});
