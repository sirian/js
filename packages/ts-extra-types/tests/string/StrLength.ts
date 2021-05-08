import {AssertExact, StrLength} from "../../src";

type Test = [
    AssertExact<0, StrLength<"">>,
    AssertExact<3, StrLength<"foo">>,
    AssertExact<6, StrLength<"привет">>,
    AssertExact<1 | 2, StrLength<"x" | "xx">>,
    AssertExact<number, StrLength<string>>,
];

export default Test;
