import {AssertExact, FromEntry, Rec} from "../../src";

type Test = [
    AssertExact<{}, FromEntry<[]>>,
    AssertExact<{ foo: 1 }, FromEntry<["foo", 1]>>,
    AssertExact<{ 0: 1 }, FromEntry<[0, 1]>>,
    AssertExact<{ "0": 1 }, FromEntry<["0", 1]>>,
    AssertExact<{}, FromEntry<[undefined, 1]>>,
    AssertExact<{ 0?: 1 }, FromEntry<[0 | undefined, 1]>>,
    AssertExact<{ 0: 1 | undefined }, FromEntry<[0, 1 | undefined]>>,

    AssertExact<{ 0?: 1 }, FromEntry<[0?, 1?]>>,
    AssertExact<{ 0?: undefined }, FromEntry<[0?]>>,
    AssertExact<Rec<number, string>, FromEntry<[number, string]>>,
    AssertExact<Rec<1, string>, FromEntry<[1, string]>>,

    AssertExact<{ a: 1 } | { a: undefined } | { b: boolean },
        FromEntry<["a", 1] | ["a", undefined] | ["b", boolean]>>
];
