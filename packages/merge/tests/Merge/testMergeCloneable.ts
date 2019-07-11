import {Merge} from "../../src";

describe("mergeCloneable", () => {
    const d = new Date();
    const foo = {d};
    Object.freeze(d);
    Object.freeze(foo);

    test("clone: true", () => {
        const actual = Merge.merge([foo], {clone: true});
        expect(actual).toBe(foo);
    });

    test("clone: true", () => {
        const actual = Merge.merge([{}, foo], {clone: true});
        expect(actual).toStrictEqual(foo);
        expect(actual).not.toBe(foo);
        expect(actual.d).toBe(d);
    });

    test("clone: true", () => {
        const actual = Merge.merge([foo, {}], {clone: true});
        expect(actual).toStrictEqual(foo);
        expect(actual).not.toBe(foo);
        expect(actual.d).toBe(d);
    });

    test("mergeCloneable", () => {
        const actual = Merge.merge([{d: 1}, foo], {clone: false});
        expect(actual).toStrictEqual(foo);
        expect(actual.d).toBe(d);
    });
});
