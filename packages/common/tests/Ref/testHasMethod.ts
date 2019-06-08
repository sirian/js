import {Ref} from "../../src";

describe("", () => {
    const data = [
        ["", "localeCompare", true],
        [1, "toFixed", true],
        ["", "slice", true],
        [1, "slice", false],
        [[], "slice", true],
        [{}, "toString", true],
        [Object.create(null), "toString", false],
        [null, "toString", false],
        [undefined, "toString", false],
        [/./, "test", true],
        [/./, "foo", false],
    ];

    test.each(data)("Var.hasMethod(%o, %o) === %o", (target, key, expected) => {
        expect(Ref.hasMethod(target, key)).toBe(expected);
    });
});
