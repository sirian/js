import {AssertExact, FromEntry, Rec} from "../../src";

type Test = [
    AssertExact<{}, FromEntry<[never, 1]>>,
    AssertExact<{ foo: 1 }, FromEntry<["foo", 1]>>,
    AssertExact<{ 0: 1 }, FromEntry<[0, 1]>>,
    AssertExact<{ "0": 1 }, FromEntry<["0", 1]>>,
    AssertExact<{ 0: 1 | undefined }, FromEntry<[0, 1 | undefined]>>,
    AssertExact<Rec<number, string>, FromEntry<[number, string]>>,
    AssertExact<{ 1: string }, FromEntry<[1, string]>>,

    AssertExact<{ a: 1 | undefined, b: boolean }, FromEntry<["a", 1] | ["a", undefined] | ["b", boolean]>>
];
