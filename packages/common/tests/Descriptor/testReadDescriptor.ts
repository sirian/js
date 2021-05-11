import {noop, readDescriptor} from "../../src";

describe("", () => {
    const desc = {
        get(this: any) {
            return this.length;
        },
    };

    const data = [
        [undefined, undefined, undefined],
        [undefined, null, undefined],
        [undefined, {}, undefined],
        [null, undefined, undefined],
        [null, null, undefined],
        [null, {}, undefined],
        [{}, undefined, undefined],
        [{}, null, undefined],
        [{}, {}, undefined],

        [{value: 1}, {}, 1],
        [{value: 1}, null, 1],
        [{value: 1}, undefined, 1],

        [{get: () => 1}, {}, 1],
        [{get: () => 1}, null, 1],
        [{get: () => 1}, undefined, 1],

        [{set: noop}, {}, undefined],
        [{set: noop}, null, undefined],
        [{set: noop}, undefined, undefined],

        [{get: undefined}, {}, undefined],

        [desc, {}, undefined],
        [desc, {length: 1}, 1],
        [desc, [1, 2, 3], 3],
        [desc, "foo", 3],
        [desc, 1, undefined],
    ] as const;

    test.each(data)("readDescriptor(%o, %o) === %o", (descriptor, obj, expected) => {
        expect(readDescriptor(descriptor, obj)).toBe(expected);
    });

    test("readDescriptor(desc, null | undefined)", () => {
        expect(() => readDescriptor(desc, null)).toThrow();
        expect(() => readDescriptor(desc, undefined)).toThrow();
    });
});
