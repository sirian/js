import {Obj, XMap} from "../../src";

describe("XMap.toObject", () => {
    const data = [
        {},
        {x: 1},
        {x: 1, y: 2},
    ];

    const errorData = [
        new XMap([[undefined, 1]]),
        new XMap([[null, 1]]),
        new XMap([[{}, {}]]),
    ];

    test.each(data)("toObject(entries(%p))", (obj) => {
        const map = new XMap(Obj.entries(obj));

        expect(map.toObject()).toStrictEqual(obj);
    });

    test.each(errorData)("%o.toObject() throws", (map: XMap) => {
        expect(() => map.toObject()).toThrow(Error);
    });
});
