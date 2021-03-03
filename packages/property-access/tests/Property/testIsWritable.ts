import {PropertyAccessor} from "../../src";

const notWritableX = [
    null, undefined, "foo", 3,
    Object.create({type: "writable"}, {x: {writable: false}}),
    Object.create({type: "getter"}, {x: {get: () => 1}}),
    Object.seal({type: "sealed"}),
    Object.freeze({type: "frozen", x: 1}),
    Object.freeze({type: "frozen"}),
];

const writableX = [
    {}, [], () => 1, Object.create(null),
    Object.seal({type: "sealed", x: 1}),
];

const obj = {
    o: {foo: [123]}, a: [], n: 456, s: "str",
};

const notWritableObjKeys = [
    "o.foo[0].x", "o.x.y",
    "a[0].x", "a.x.y", "a[1].foo",
    "n.x", "s[0]", "x[0]",
];
const writableObjKeys = [
    "o",
    "o.foo", "o.bar",
    "o.foo.0", "o.foo.1", "o.foo[2]",
    "a", "a.0", "a[0]", "a.length", "a[length]",
    "n", "s", "x",
];

const data = [
    ...writableX.map((o) => [o, "x", true]),
    ...notWritableX.map((o) => [o, "x", false]),

    ...writableObjKeys.map((k) => [obj, k, true]),
    ...notWritableObjKeys.map((k) => [obj, k, false]),
];

test.each(data)(`PropertyAccessor.isWritable(%p, %p) === %p`, (o, path, expected) => {
    const accessor = new PropertyAccessor();
    expect(accessor.isWritable(o, path)).toBe(expected);
});
