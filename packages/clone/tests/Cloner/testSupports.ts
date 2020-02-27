import {Obj} from "@sirian/common";
import {cloner, cloneSymbol} from "../../src";

class Foo {

}

class Bar extends Foo {
    public [cloneSymbol]() {}
}

class Baz extends Bar {

}

const trueData = [
    42,
    "42",
    true,
    null,
    undefined,
    Object(42),
    Object("42"),
    Object(true),
    new Date(),
    /42/i,
    [1, 2, 3],
    {},
    Obj.create(null),
    new Uint8Array([1, 2, 3]),
    new Set(),
    new Map(),
    new ArrayBuffer(42),
    new DataView(new ArrayBuffer(42)),
    new Bar(),
    new Baz(),
];

const falseData = [
    new WeakMap(),
    new WeakSet(),
    new class {}(),
    new Foo(),
];

const data = [
    ...trueData.map<[any, boolean]>((x) => [x, true]),
    ...falseData.map<[any, boolean]>((x) => [x, false]),
];

test.each(data)("Cloner.supports(%O) === %p", (obj, expected) => {
    expect(cloner.supports(obj)).toBe(expected);
});

test("", () => {
    expect(cloner.supports(Obj.create(null))).toBe(true);
});
