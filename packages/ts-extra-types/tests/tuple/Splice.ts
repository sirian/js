import {AssertExact, Splice} from "../../src";

type Test = [
    AssertExact<[], Splice<[], 0>>,
    AssertExact<[], Splice<[1], 0>>,
    AssertExact<[2], Splice<[1, 2], 0>>,
    AssertExact<[1], Splice<[1, 2], 1>>,
    AssertExact<[], Splice<[1, 2], 0, 2>>,
    AssertExact<[2?], Splice<[1, 2?], 0>>,
    AssertExact<[1], Splice<[1, 2?], 1>>,
    AssertExact<[1, 3?], Splice<[1, 2?, 3?], 1>>,
    AssertExact<[1, 2], Splice<[1, 2], 2>>,
    AssertExact<[], Splice<[1, 2], 0, number>>,
    AssertExact<[2, ...3[]], Splice<[1, 2, ...3[]], 0>>,
    AssertExact<[1, 2, ...3[]], Splice<[1, 2, ...3[]], 0, 0>>,
    AssertExact<[2, ...3[]], Splice<[1, 2, ...3[]], 0, 1>>,
    AssertExact<3[], Splice<[1, 2, ...3[]], 0, 2>>
];

export default Test;
