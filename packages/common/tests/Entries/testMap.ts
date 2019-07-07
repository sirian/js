import {Entries} from "../../src/Entries";

describe("Entries.modify", () => {
    const foo = {x: "a", y: "b"};
    const data: Array<[any, any]> = [];

    test("Entries.modify", () => {
        const result = Entries
            .from(foo)
            .map((k, v) => [v, k])
            .toObject();
        expect(result).toStrictEqual({a: "x", b: "y"});
    });
});
