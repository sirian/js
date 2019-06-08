import {AccessorPropertyDescriptor, DataPropertyDescriptor} from "@sirian/ts-extra-types";
import {Descriptor, Obj, Ref} from "../../src";

describe("", () => {
    const dataDescriptors: DataPropertyDescriptor[] = [
        {},
        Obj.create(),
        {configurable: true},
        {configurable: false},
        {configurable: undefined},
        {writable: true},
        {writable: false},
        {writable: undefined},
        {enumerable: true},
        {enumerable: false},
        {enumerable: undefined},
        {value: undefined},
    ];

    const accessorDescriptors: AccessorPropertyDescriptor[] = [
        {get: () => 1, set: undefined},
        {get: () => 1},
        {get: () => 1, set: () => void 0},
        {get: undefined, set: () => void 0},
        {set: () => void 0},
    ];

    const descriptors = [
        ...Obj.values(Ref.getOwnDescriptors(Object)),
        ...Obj.values(Ref.getOwnDescriptors(Function)),
    ];

    const invalidDescriptors = [
        {writable: 1},
        {configurable: 1},
        {enumerable: 1},
        {writable: 0},
        {configurable: 0},
        {enumerable: 0},
        {writable: undefined, get: () => 1},
        {writable: undefined, set: () => 1},
        {writable: false, get: () => 1},
        {writable: false, set: () => 1},
        {writable: false, get: undefined},
        {writable: false, set: undefined},
        {value: undefined, get: undefined},
        {value: undefined, set: undefined},
        {value: undefined, set: () => void 0},
        {value: undefined, get: () => void 0},
        {foo: 1},
        {foo: 1, value: 2},
    ];

    test.each(accessorDescriptors)("Descriptor.isAccessorDescriptor(%o) === true", (value) => {
        expect(Descriptor.isDescriptor(value)).toBe(true);
        expect(Descriptor.isAccessorDescriptor(value)).toBe(true);
        expect(Descriptor.isDataDescriptor(value)).toBe(false);
    });

    test.each(dataDescriptors)("Descriptor.isDataDescriptor(%o) === true", (value) => {
        expect(Descriptor.isDescriptor(value)).toBe(true);
        expect(Descriptor.isDataDescriptor(value)).toBe(true);
        expect(Descriptor.isAccessorDescriptor(value)).toBe(false);
    });

    test.each(descriptors)("Descriptor.isDescriptor(%o) === true", (value) => {
        expect(Descriptor.isDescriptor(value)).toBe(true);
    });

    test.each(invalidDescriptors)("Descriptor.isDescriptor(%p) === false", (value) => {
        expect(Descriptor.isDescriptor(value)).toBe(false);
        expect(Descriptor.isAccessorDescriptor(value)).toBe(false);
        expect(Descriptor.isDataDescriptor(value)).toBe(false);
    });
});
