import {toObject} from "@sirian/common";
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
    toObject(42),
    toObject("42"),
    toObject(true),
    new Date(),
    /42/i,
    [1, 2, 3],
    {},
    Object.create(null),
    new Uint8Array([1, 2, 3]),
    new Set(),
    new Map(),
    new ArrayBuffer(42),
    new DataView(new ArrayBuffer(42)),
    new Bar(),
    new Baz(),
].map((v) => [v, true]);

const falseData = [
    new WeakMap(),
    new WeakSet(),
    new class {}(),
    new Foo(),
].map((v) => [v, false]);

test.each([...trueData, ...falseData])("Cloner.supports(%O) === %p", (obj, expected) => {
    expect(cloner.supports(obj)).toBe(expected);
});
