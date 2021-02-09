import {AssertExact, StrJoin} from "../../src";

type Test = [
    AssertExact<"", StrJoin<[]>>,
    AssertExact<"", StrJoin<[], ".">>,
    AssertExact<"x", StrJoin<["x"]>>,
    AssertExact<"x", StrJoin<["x"], ".">>,
    AssertExact<"xy", StrJoin<["x", "y"]>>,
    AssertExact<"x.y", StrJoin<["x", "y"], ".">>,

    AssertExact<string, StrJoin<"x"[]>>,
    AssertExact<string, StrJoin<"x"[], ".">>,
    AssertExact<string, StrJoin<string[]>>,
    AssertExact<string, StrJoin<string[], ".">>,
];
