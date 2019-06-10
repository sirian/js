import {CloneError, Cloner} from "../../src";
import {TestCloner} from "../TestCloner";

describe("Cloner.clone with maxDepth", () => {
    const obj = {
        x: {
            y: {
                z: 0,
            },
        },
    };

    TestCloner.multiTest(obj);

    test("maxDepth = -1", () => {
        const expectedErr = new CloneError("Cloner.clone option maxDepth should be >= 0");
        expect(() => Cloner.clone(obj, {maxDepth: -1})).toThrow(expectedErr);
    });

    test("maxDepth = undefined", () => {
        const clone = Cloner.clone(obj, {maxDepth: undefined});
        expect(clone).toStrictEqual(obj);
        expect(clone).not.toBe(obj);
        expect(clone.x).toBe(obj.x);
    });

    test("maxDepth = 0", () => {
        const clone = Cloner.clone(obj, {maxDepth: 0});
        expect(clone).toStrictEqual(obj);
        expect(clone).not.toBe(obj);
        expect(clone.x).toBe(obj.x);
    });

    test("maxDepth = 1", () => {
        const clone = Cloner.clone(obj, {maxDepth: 1});
        expect(clone).toStrictEqual(obj);
        expect(clone).not.toBe(obj);
        expect(clone.x).not.toBe(obj.x);
        expect(clone.x.y).toBe(obj.x.y);
    });

    test("maxDepth = 2", () => {
        const clone = Cloner.clone(obj, {maxDepth: 2});
        expect(clone).toStrictEqual(obj);
        expect(clone).not.toBe(obj);
        expect(clone.x).not.toBe(obj.x);
        expect(clone.x.y).not.toBe(obj.x.y);
        expect(clone.x.y.z).toBe(obj.x.y.z);
    });

    test("maxDepth = +Infinity", () => {
        const clone = Cloner.clone(obj, {maxDepth: 1 / 0});
        expect(clone).toStrictEqual(obj);
        expect(clone).not.toBe(obj);
        expect(clone.x).not.toBe(obj.x);
        expect(clone.x.y).not.toBe(obj.x.y);
        expect(clone.x.y.z).toBe(obj.x.y.z);
    });
});
