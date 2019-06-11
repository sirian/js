import {XSet} from "../../src";

describe("", () => {
    test("XSet.first", () => {
        const set = new XSet();

        expect(set.first()).toBe(undefined);

        set.add(1, 2, 3);

        expect(set.first()).toBe(1);

        set.delete(1);

        expect(set.first()).toBe(2);

        set.clear();

        expect(set.first()).toBe(undefined);
    });
});
