import {AssertExact, UnionToTuple} from "../../src";

type Test = [
    AssertExact<UnionToTuple<1>, [1]>,
    AssertExact<UnionToTuple<1 | 2>, [1, 2] | [2, 1]>,
    AssertExact<UnionToTuple<1 | 3 | 2>,
        [1, 3, 2] |
        [1, 2, 3] |
        [3, 1, 2] |
        [3, 2, 1] |
        [2, 1, 3] |
        [2, 3, 1]>
];

export default Test;
