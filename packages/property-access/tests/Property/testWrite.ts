import {PropertyAccessor} from "../../src";

const data: Array<[any, string | number, any, any]> = [
    [{}, "foo", 1, {foo: 1}],
    [{foo: 2}, "foo", 1, {foo: 1}],
    [{foo: 2, bar: 3}, "foo", 1, {foo: 1, bar: 3}],

    [{0: "foo", 1: "bar", 2: "baz"}, 1, "zoo", {0: "foo", 1: "zoo", 2: "baz"}],
    [["foo", "bar", "baz"], 1, "zoo", ["foo", "zoo", "baz"]],
    [["foo", "bar", "baz"], "length", 1, ["foo"]],

    [["foo", {x: 1}, "baz"], "[1].x", 2, ["foo", {x: 2}, "baz"]],
    [{}, "foo", 1, {foo: 1}],
    [{bar: 3}, "foo", 1, {bar: 3, foo: 1}],
    // eslint-disable-next-line no-sparse-arrays
    [{}, "foo[2].3", 1, {foo: [/*hole*/, /*hole*/, {3: 1}]}], // tslint:disable-line:no-sparse-arrays
    [{}, "foo[bar][0]", 1, {foo: Object.assign([], {bar: [1]})}],
];

test.each(data)("Property.setValue(%p, %p, %p)", (target, path, value, expected) => {
    const accessor = new PropertyAccessor();
    accessor.write(target, path, value);

    expect(target).toStrictEqual(expected);
    expect(accessor.read(target, path)).toBe(value);
});
