import {clone, CloneError} from "../../src";
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
        expect(() => clone(obj, {maxDepth: -1})).toThrow(expectedErr);
    });

    test("maxDepth = undefined", () => {
        const copy = clone(obj, {maxDepth: undefined});
        expect(copy).toStrictEqual(obj);
        expect(copy).not.toBe(obj);
        expect(copy.x).toBe(obj.x);
    });

    test("maxDepth = 0", () => {
        const copy = clone(obj, {maxDepth: 0});
        expect(copy).toStrictEqual(obj);
        expect(copy).not.toBe(obj);
        expect(copy.x).toBe(obj.x);
    });

    test("maxDepth = 1", () => {
        const copy = clone(obj, {maxDepth: 1});
        expect(copy).toStrictEqual(obj);
        expect(copy).not.toBe(obj);
        expect(copy.x).not.toBe(obj.x);
        expect(copy.x.y).toBe(obj.x.y);
    });

    test("maxDepth = 2", () => {
        const copy = clone(obj, {maxDepth: 2});
        expect(copy).toStrictEqual(obj);
        expect(copy).not.toBe(obj);
        expect(copy.x).not.toBe(obj.x);
        expect(copy.x.y).not.toBe(obj.x.y);
        expect(copy.x.y.z).toBe(obj.x.y.z);
    });

    test("maxDepth = +Infinity", () => {
        const copy = clone(obj, {maxDepth: 1 / 0});
        expect(copy).toStrictEqual(obj);
        expect(copy).not.toBe(obj);
        expect(copy.x).not.toBe(obj.x);
        expect(copy.x.y).not.toBe(obj.x.y);
        expect(copy.x.y.z).toBe(obj.x.y.z);
    });
});
