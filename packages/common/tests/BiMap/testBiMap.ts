import {BiMap, XSet} from "../../src";

describe("", () => {

    const check = (iterable: any, ...entries: any) => {
        expect([...iterable]).toStrictEqual(entries);
    };

    const checkReverse = (map: any, ...entries: any[]) => {
        check(map.reverse, ...entries.map(([k, v]) => [k, new XSet(v)]));
    };

    test("", () => {
        const map = new BiMap();
        map
            .set("x", 1)
            .set("y", 1)
            .set("z", 2);
        check(map, ["x", 1], ["y", 1], ["z", 2]);
        checkReverse(map, [1, ["x", "y"]], [2, ["z"]]);
        map.delete("y");

        check(map, ["x", 1], ["z", 2]);
        checkReverse(map, [1, ["x"]], [2, ["z"]]);

        map.set("x", 2);

        check(map, ["x", 2], ["z", 2]);
        checkReverse(map, [2, ["x", "z"]]);
    });
});
