import {AssertExact, IndexRange} from "../../src";

type Test = [
    AssertExact<never, IndexRange<0>>,
    AssertExact<0, IndexRange<1>>,
    AssertExact<0 | 1, IndexRange<2>>,
    AssertExact<0 | 1 | 2 | 3, IndexRange<2 | 4>>
];
