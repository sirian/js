import {getDescriptor} from "../../src";

const desc = (value: any, enumerable = false, configurable = true, writable = true): PropertyDescriptor => ({
    value,
    enumerable,
    configurable,
    writable,
});

const data: Array<[any, PropertyKey, PropertyDescriptor?]> = [
    [{}, "hasOwnProperty", desc(Object.hasOwnProperty, false)],
    [{}, "x", undefined],
    [{x: "foo"}, "x", desc("foo", true)],
    [["foo"], 0, desc("foo", true)],
    [["foo"], 1, undefined],
    [["foo"], "length", desc(1, false, false)],
    [false, "toString", desc(Boolean.prototype.toString, false)],
    [0, "toString", desc(Number.prototype.toString, false)],
    [1, "toFixed", desc(Number.prototype.toFixed, false)],
    [NaN, "toFixed", desc(Number.prototype.toFixed, false)],
    [null, "toString", undefined],
    [undefined, "toString", undefined],
];

test.each(data)("Ref.descriptor(%p, %p) === %p", (target, key, expected) => {
    const descriptor = getDescriptor(target, key);
    expect(descriptor).toStrictEqual(expected!);
});
