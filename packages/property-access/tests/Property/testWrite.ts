import {Property} from "../../src";

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
];

test.each(data)("Property.setValue(%p, %p, %p)", (target, path, value, expected) => {
    Property.write(target, path, value);

    expect(target).toStrictEqual(expected);
    expect(Property.read(target, path)).toBe(value);
});
