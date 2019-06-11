import {AssertExact, NumberToString} from "../../src";

type Test = [
    AssertExact<"0", NumberToString<0>>,
    AssertExact<"1", NumberToString<1>>,
    AssertExact<"2", NumberToString<2>>,
    AssertExact<"3", NumberToString<3>>,
    AssertExact<"9", NumberToString<9>>,
    AssertExact<string, NumberToString<number>>
];
