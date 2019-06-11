import {Descriptor} from "../../src";

describe("", () => {
    const desc: PropertyDescriptor = {
        get(this: any) {
            return this.x;
        },
    };

    const data: Array<[PropertyDescriptor, any, any]> = [
        [{}, {}, undefined],
        [{}, undefined, undefined],

        [{value: 1}, {}, 1],
        [{value: 1}, undefined, 1],

        [{get: () => 1}, {}, 1],
        [{get: () => 1}, undefined, 1],

        [{set: () => void 0}, {}, undefined],
        [{set: () => void 0}, undefined, undefined],

        [desc, {}, undefined],
        [desc, {x: 1}, 1],
    ];

    test.each(data)("Descriptor.read(%o, %o) === %o", (descriptor, obj, expected) => {
        expect(Descriptor.read(descriptor, obj)).toBe(expected);
    });
});
