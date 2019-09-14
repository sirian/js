import {Ref} from "@sirian/common";
import {StrictObject} from "../../src";

describe("StrictObject.has", () => {
    test("StrictObject.has", () => {
        const target: any = {
            x: 1,
        };

        const o = StrictObject.from(target);

        expect(Ref.has(target, "x")).toBe(true);
        expect(Ref.has(o, "x")).toBe(true);

        expect(Ref.has(target, "y")).toBe(false);
        expect(Ref.has(o, "y")).toBe(false);

        expect(Ref.has(target, "hasOwnProperty")).toBe(true);
        expect(Ref.has(o, "hasOwnProperty")).toBe(false);

        expect(Ref.has(target, "__proto__")).toBe(true);
        expect(Ref.has(o, "__proto__")).toBe(false);
    });
});
