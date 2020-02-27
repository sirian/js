import {instanceOfGuard} from "@sirian/common";
import {Predicate} from "@sirian/ts-extra-types";
import {clone, cloneDeep, CloneError} from "../../src";

describe("", () => {
    const obj = {
        x: new WeakSet(),
        y: new WeakMap(),
    };

    test("", () => {
        const copy = clone(obj);
        expect(copy).toStrictEqual(obj);
        expect(copy).not.toBe(obj);
        expect(copy.x).toBe(obj.x);
        expect(copy.y).toBe(obj.y);
    });

    test("", () => {
        const copy = cloneDeep(obj, {
            bypass: instanceOfGuard(WeakMap, WeakSet),
        });
        expect(copy).toStrictEqual(obj);
        expect(copy).not.toBe(obj);
        expect(copy.x).toBe(obj.x);
        expect(copy.y).toBe(obj.y);
    });

    const bypassErrors: Predicate[] = [
        () => false,
        instanceOfGuard(WeakMap),
        instanceOfGuard(WeakSet),
    ];

    test.each(bypassErrors)("", (bypass) => {
        expect(() => clone(obj, {maxDepth: 1, bypass})).toThrow(CloneError);
        expect(() => cloneDeep(obj, {bypass})).toThrow(CloneError);
    });
});
