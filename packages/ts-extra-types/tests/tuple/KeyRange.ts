import {AssertExact, KeyRange} from "../../src";

type Test = [
    AssertExact<never, KeyRange<0>>,
    AssertExact<"0", KeyRange<1>>,
    AssertExact<"0" | "1", KeyRange<2>>,
    AssertExact<"0" | "1" | "2" | "3", KeyRange<2 | 4>>
];
