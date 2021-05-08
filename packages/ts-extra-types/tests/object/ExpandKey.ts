import {AssertExact, ExpandKey} from "../../src";

type Test = [
    AssertExact<0 | "0", ExpandKey<0>>,
    AssertExact<0 | "0", ExpandKey<"0">>,
    AssertExact<string, ExpandKey<string>>,
    AssertExact<0 | string, ExpandKey<0 | string>>,
    AssertExact<number, ExpandKey<number>>,
    AssertExact<"0" | number, ExpandKey<"0" | number>>,
];

export default Test;
