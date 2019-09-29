import {Dump} from "../../src";

describe("Dump snapshot", () => {
    test("dump snapshot", () => {
        const o = {
            x: 1,
            y: {
                z: 2,
            },
        };

        const dump = new Dump(o);

        expect(dump.snapshot).toStrictEqual(o);

        o.x = 3;
        o.y = {z: 4};

        expect(o).toStrictEqual({x: 3, y: {z: 4}});
        expect(dump.snapshot).toStrictEqual({x: 1, y: {z: 2}});
    });
});
