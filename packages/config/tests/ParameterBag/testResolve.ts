import {Obj} from "@sirian/common";
import {ParameterBag} from "../../src";

describe("ParameterBag.resolve", () => {
    test("ParameterBag.resolve", () => {
        const p = new ParameterBag({
            foo: "f",
            bar: "b%foo%",
            baz: 42,
            zoo: "z%bar%%foo%%bar% %baz%",
        });

        p.resolve();

        const expected = {
            foo: "f",
            bar: "bf",
            zoo: "zbffbf 42",
        };

        for (const [k, v] of Obj.entries(expected)) {
            expect(p.get(k)).toBe(v);
        }
    });
});
