import {AssertExact, StripArray} from "../../src";

type Test = [
    AssertExact<{}, StripArray<[]>>,
    AssertExact<{ "0": 1 }, StripArray<[1]>>,
    AssertExact<{ "0"?: 1 }, StripArray<[1?]>>,
    AssertExact<{ "0": 1, "1": 2 }, StripArray<[1, 2]>>,
    AssertExact<{ "0": 1, "1"?: 2 }, StripArray<[1, 2?]>>,
    AssertExact<{ [x: number]: 1 | 2 } & { "0": 1 }, StripArray<[1, ...2[]]>>,
    AssertExact<{ [x: number]: 1 }, StripArray<1[]>>,
    AssertExact<{ [x: number]: 1 }, StripArray<1[]>>,
    AssertExact<{ 0: 1 }, StripArray<{ 0: 1 }>>,
    AssertExact<{ "0": 1 }, StripArray<[1 | 2] & { 0: 1 | 3 }>>
];
