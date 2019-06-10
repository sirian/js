import {Var} from "@sirian/common";
import {Predicate} from "@sirian/ts-extra-types";
import {CloneError, Cloner} from "../../src";

describe("", () => {
    const obj = {
        x: new WeakSet(),
        y: new WeakMap(),
    };

    test("", () => {
        const clone = Cloner.clone(obj);
        expect(clone).toStrictEqual(obj);
        expect(clone).not.toBe(obj);
        expect(clone.x).toBe(obj.x);
        expect(clone.y).toBe(obj.y);
    });

    test("", () => {
        const clone = Cloner.cloneDeep(obj, {
            bypass: (o) => Var.isInstanceOf(o, WeakMap) || Var.isInstanceOf(o, WeakSet),
        });
        expect(clone).toStrictEqual(obj);
        expect(clone).not.toBe(obj);
        expect(clone.x).toBe(obj.x);
        expect(clone.y).toBe(obj.y);
    });

    const bypassErrors: Predicate[] = [
        () => false,
        (o) => Var.isInstanceOf(o, WeakMap),
        (o) => Var.isInstanceOf(o, WeakSet),
    ];

    test.each(bypassErrors)("", (bypass) => {
        expect(() => Cloner.clone(obj, {maxDepth: 1, bypass})).toThrow(CloneError);
        expect(() => Cloner.cloneDeep(obj, {bypass})).toThrow(CloneError);
    });
});
