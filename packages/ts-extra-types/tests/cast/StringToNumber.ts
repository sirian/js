import {AssertExact, StringToNumber} from "../../src";

type Test = [
    AssertExact<0, StringToNumber<"0">>,
    AssertExact<1, StringToNumber<"1">>,
    AssertExact<2, StringToNumber<"2">>,
    AssertExact<3, StringToNumber<"3">>,
    AssertExact<9, StringToNumber<"9">>,
    AssertExact<number, StringToNumber<string>>
];
