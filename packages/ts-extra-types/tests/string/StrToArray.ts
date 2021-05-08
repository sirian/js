import {AssertExact, StrToArray} from "../../src";

type Test = [
    AssertExact<[], StrToArray<"">>,
    AssertExact<string[], StrToArray<string>>,
    AssertExact<["f"], StrToArray<"f">>,
    AssertExact<["f", "o", "o"], StrToArray<"foo">>,
    AssertExact<["п", "р", "и", "в", "е", "т"], StrToArray<"привет">>,
];
