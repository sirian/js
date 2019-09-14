import {PropertyNotExistError, StrictObject} from "../../src";

describe("StrictObject.get", () => {
    test("StrictObject.get", () => {
        const target: any = {
            x: 1,
        };

        const o = StrictObject.from(target);

        expect(o.x).toBe(1);
        expect(target.x).toBe(1);

        target.x = 2;
        expect(o.x).toBe(2);
        expect(target.x).toBe(2);

        o.x = 3;
        expect(o.x).toBe(3);
        expect(target.x).toBe(3);

        delete o.x;

        expect(() => o.x).toThrow(PropertyNotExistError);
        expect(target.x).toBe(undefined);
    });
});
