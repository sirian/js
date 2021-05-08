import {AssertExact, Range} from "../../src";

type Test = [
    AssertExact<[0], Range<0>>,
    AssertExact<[0, 1], Range<1>>,
    AssertExact<[0, 1, 2], Range<2>>,
    AssertExact<[0, 1, 2, 3, 4, 5], Range<5>>,
];

export default Test;
