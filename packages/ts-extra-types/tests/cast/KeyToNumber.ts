import {AssertExact, KeyToNumber} from "../../src";

type Test = [
    AssertExact<0, KeyToNumber<"0">>,
    AssertExact<1, KeyToNumber<"1">>,
    AssertExact<2, KeyToNumber<"2">>,
    AssertExact<3, KeyToNumber<"3">>,
    AssertExact<9, KeyToNumber<"9">>,
    AssertExact<never, KeyToNumber<string>>
];
