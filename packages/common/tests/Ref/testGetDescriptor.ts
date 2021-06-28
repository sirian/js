import {getDescriptor} from "../../src";

const desc = (value: unknown, enumerable = false, configurable = true, writable = true): PropertyDescriptor => ({
    value,
    enumerable,
    configurable,
    writable,
});

const data = [
    // eslint-disable-next-line @typescript-eslint/unbound-method
    [{}, "hasOwnProperty", desc(Object.hasOwnProperty, false)],
    [{}, "x", undefined],
    [{x: "foo"}, "x", desc("foo", true)],
    [["foo"], 0, desc("foo", true)],
    [["foo"], 1, undefined],
    [["foo"], "length", desc(1, false, false)],
    // eslint-disable-next-line @typescript-eslint/unbound-method
    [false, "toString", desc(Boolean.prototype.toString, false)],
    // eslint-disable-next-line @typescript-eslint/unbound-method
    [0, "toString", desc(Number.prototype.toString, false)],
    // eslint-disable-next-line @typescript-eslint/unbound-method
    [1, "toFixed", desc(Number.prototype.toFixed, false)],
    // eslint-disable-next-line @typescript-eslint/unbound-method
    [NaN, "toFixed", desc(Number.prototype.toFixed, false)],
    [null, "toString", undefined],
    [undefined, "toString", undefined],
] as const;

test.each(data)("Ref.descriptor(%p, %p) === %p", (target, key, expected) => {
    expect(getDescriptor(target, key)).toStrictEqual(expected);
});
