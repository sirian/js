import {TestUtil} from "../../../common/tests/TestUtil";
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
    Object.create(null),
    new Uint8Array([1, 2, 3]),
    new Set(),
    new Map(),
    new ArrayBuffer(42),
    new DataView(new ArrayBuffer(42)),
    new Bar(),
    new Baz(),
] as const;

const falseData = [
    new WeakMap(),
    new WeakSet(),
    new class {}(),
    new Foo(),
] as const;

const data = TestUtil.mergeData(trueData, falseData);
test.each(data)("Cloner.supports(%O) === %p", (obj, expected) => {
    expect(cloner.supports(obj)).toBe(expected);
});
