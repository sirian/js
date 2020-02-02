import {Descriptor} from "../../src";

describe("", () => {
    const desc = {
        get(this: any) {
            return this.x;
        },
    };

    const noop = () => void 0;

    const data: Array<[PropertyDescriptor, any, any]> = [
        [undefined, undefined, undefined],
        [undefined, null, undefined],
        [undefined, {}, undefined],
        [{}, undefined, undefined],
        [{}, null, undefined],
        [{}, {}, undefined],

        [{value: 1}, {}, 1],
        [{value: 1}, null, undefined],
        [{value: 1}, undefined, undefined],

        [{get: () => 1}, {}, 1],
        [{get: () => 1}, null, undefined],
        [{get: () => 1}, undefined, undefined],

        [{set: noop}, {}, undefined],
        [{set: noop}, null, undefined],
        [{set: noop}, undefined, undefined],

        [desc, undefined, undefined],
        [desc, null, undefined],
        [desc, {}, undefined],
        [desc, {x: 1}, 1],
    ];

    test.each(data)("Descriptor.read(%o, %o) === %o", (descriptor, obj, expected) => {
        expect(Descriptor.read(descriptor, obj)).toBe(expected);
    });
});
