import {AssertExact, KeyToString} from "../../src";

type Test = [
    AssertExact<"0", KeyToString<0>>,
    AssertExact<"1", KeyToString<1>>,
    AssertExact<"2", KeyToString<2>>,
    AssertExact<"3", KeyToString<3>>,
    AssertExact<"9", KeyToString<9>>,
    AssertExact<never, KeyToString<number>>
];
