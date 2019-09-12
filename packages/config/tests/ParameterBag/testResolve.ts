import {Obj} from "@sirian/common";
import {ParameterBag} from "../../src";

describe("ParameterBag.resolve", () => {
    test("ParameterBag.resolve", () => {
        const p = new ParameterBag({
            foo: "f",
            bar: "b%foo%",
            zoo: "z%bar%%foo%%bar%",
        });

        p.resolve();

        const expected = {
            foo: "f",
            bar: "bf",
            zoo: "zbffbf",
        };

        for (const [k, v] of Obj.entries(expected)) {
            expect(p.get(k)).toBe(v);
        }
    });
});
