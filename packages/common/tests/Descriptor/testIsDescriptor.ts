import {AccessorPropertyDescriptor, DataPropertyDescriptor} from "@sirian/ts-extra-types";
import {isAccessorDescriptor, isDataDescriptor, isDescriptor, ownDescriptors, valuesOf} from "../../src";

describe("Descriptor", () => {
    const dataDescriptors: DataPropertyDescriptor[] = [
        {},
        Object.create(null),
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
        {foo: 1, value: 2},
    ];

    const accessorDescriptors: AccessorPropertyDescriptor[] = [
        {get: () => 1, set: undefined},
        {get: () => 1},
        {get: () => 1, set: () => void 0},
        {get: undefined, set: () => void 0},
        {set: () => void 0},
    ];

    const descriptors = [
        ...valuesOf(ownDescriptors(Object)),
        ...valuesOf(ownDescriptors(Function)),
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
        {get: "foo"},
        {set: "foo"},
        {get: "foo", set: () => 1},
        {get: () => 1, set: "foo"},
        {value: undefined, get: undefined},
        {value: undefined, set: undefined},
        {value: undefined, set: () => void 0},
        {value: undefined, get: () => void 0},
    ];

    test.each(accessorDescriptors)("Descriptor.isAccessorDescriptor(%o) === true", (value) => {
        expect(isDescriptor(value)).toBe(true);
        expect(isAccessorDescriptor(value)).toBe(true);
        expect(isDataDescriptor(value)).toBe(false);
    });

    test.each(dataDescriptors)("Descriptor.isDataDescriptor(%o) === true", (value) => {
        expect(isDescriptor(value)).toBe(true);
        expect(isDataDescriptor(value)).toBe(true);
        expect(isAccessorDescriptor(value)).toBe(false);
    });

    test.each(descriptors)("Descriptor.isDescriptor(%o) === true", (value) => {
        expect(isDescriptor(value)).toBe(true);
    });

    test.each(invalidDescriptors)("Descriptor.isDescriptor(%p) === false", (value) => {
        expect(isDescriptor(value)).toBe(false);
        expect(isAccessorDescriptor(value)).toBe(false);
        expect(isDataDescriptor(value)).toBe(false);
    });
});
