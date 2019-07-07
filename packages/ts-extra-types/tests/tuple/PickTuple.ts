import {AssertExact, StripTuple} from "../../src";

type Test = [
    AssertExact<{}, StripTuple<[]>>,

    AssertExact<{ "0": 1 }, StripTuple<[1]>>,
    AssertExact<{ "0": 1 }, StripTuple<[1, ...1[]]>>,
    AssertExact<{ "0"?: 1 }, StripTuple<[1?]>>,
    AssertExact<{ "0"?: 1 }, StripTuple<[1?, ...1[]]>>,

    AssertExact<{ "0": 1, "1": 2 }, StripTuple<[1, 2]>>,
    AssertExact<{ "0": 1, "1": 2 }, StripTuple<[1, 2, ...3[]]>>,

    AssertExact<{ "0": 1, "1"?: 2 }, StripTuple<[1, 2?]>>,
    AssertExact<{ "0": 1, "1"?: 2 }, StripTuple<[1, 2?, ...3[]]>>,

    AssertExact<{ "0"?: 1, "1"?: 2 }, StripTuple<[1?, 2?]>>,
    AssertExact<{ "0"?: 1, "1"?: 2 }, StripTuple<[1?, 2?, ...3[]]>>,

    AssertExact<{}, StripTuple<number[]>>
];
