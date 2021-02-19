import {entriesOf, XMap} from "../../src";

describe("XMap.toObject", () => {
    const data = [
        {},
        {x: 1},
        {x: 1, y: 2},
    ];

    test.each(data)("toObject(entries(%p))", (obj) => {
        const map = new XMap(entriesOf(obj));

        expect(map.toObject()).toStrictEqual(obj);
    });
});
