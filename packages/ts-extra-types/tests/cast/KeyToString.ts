import {AssertExact, KeyToString} from "../../src";

declare type Test = [
    AssertExact<"0", KeyToString<0>>,
    AssertExact<"1", KeyToString<1>>,
    AssertExact<"2", KeyToString<2>>,
    AssertExact<"3", KeyToString<3>>,
    AssertExact<"9", KeyToString<9>>,
    AssertExact<"100", KeyToString<100>>,
    AssertExact<`${number}`, KeyToString<number>>,

    AssertExact<"0", KeyToString<"0">>,
    AssertExact<"1", KeyToString<"1">>,
    AssertExact<"2", KeyToString<"2">>,
    AssertExact<"3", KeyToString<"3">>,
    AssertExact<"9", KeyToString<"9">>,
    AssertExact<"100", KeyToString<"100">>,
    AssertExact<string, KeyToString<string>>,
];
