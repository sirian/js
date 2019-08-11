import {Ref} from "../../src";

const desc = (value: any, enumerable = false, configurable = true, writable = true): PropertyDescriptor => ({
    value,
    enumerable,
    configurable,
    writable,
});

const data: Array<[object, PropertyKey, PropertyDescriptor?]> = [
    [{}, "hasOwnProperty", desc(Object.hasOwnProperty, false)],
    [{}, "x", undefined],
    [{x: "foo"}, "x", desc("foo", true)],
    [["foo"], 0, desc("foo", true)],
    [["foo"], 1, undefined],
    [["foo"], "length", desc(1, false, false)],
];

test.each(data)("Ref.descriptor(%p, %p) === %p", (target, key, expected) => {
    const descriptor = Ref.descriptor(target, key);
    expect(descriptor).toStrictEqual(expected!);
});
