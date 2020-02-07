import {hasProp} from "@sirian/common";
import {StrictObject} from "../../src";

describe("StrictObject.has", () => {
    test("StrictObject.has", () => {
        const target: any = {
            x: 1,
        };

        const o = StrictObject.from(target);

        expect(hasProp(target, "x")).toBe(true);
        expect(hasProp(o, "x")).toBe(true);

        expect(hasProp(target, "y")).toBe(false);
        expect(hasProp(o, "y")).toBe(false);

        expect(hasProp(target, "hasOwnProperty")).toBe(true);
        expect(hasProp(o, "hasOwnProperty")).toBe(false);

        expect(hasProp(target, "__proto__")).toBe(true);
        expect(hasProp(o, "__proto__")).toBe(false);
    });
});
