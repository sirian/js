import {toPrimitive} from "@sirian/common";

describe("toPrimitive", () => {
    describe("primitives", () => {
        const primitives = [null, undefined, true, false, 0, -0, 42, NaN, Infinity, -Infinity, "", "abc"];

        test.each(primitives)("toPrimitive(%o)", (i) => {
            expect(toPrimitive(i)).toBe(i);
            expect(toPrimitive(i, "string")).toBe(i);
            expect(toPrimitive(i, "number")).toBe(i);
        });
    });

    describe("Arrays", () => {
        const arrays = [[], ["a", "b"], [1, 2]];
        test.each(arrays)("toPrimitive(%o)", (...arr) => {
            expect(toPrimitive(arr)).toBe(String(arr));
            expect(toPrimitive(arr, "number")).toBe(String(arr));
            expect(toPrimitive(arr, "string")).toBe(String(arr));
        });
    });
});
