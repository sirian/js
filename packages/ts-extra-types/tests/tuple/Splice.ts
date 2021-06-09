import {AssertExact, Splice} from "../../src";

declare type Test = [
    AssertExact<[], Splice<[], 0>>,
    AssertExact<readonly [], Splice<readonly [], 0>>,

    AssertExact<[], Splice<[1], 0>>,
    AssertExact<readonly [], Splice<readonly [1], 0>>,

    AssertExact<[2], Splice<[1, 2], 0>>,
    AssertExact<readonly [2], Splice<readonly [1, 2], 0>>,

    AssertExact<[1], Splice<[1, 2], 1>>,
    AssertExact<readonly [1], Splice<readonly [1, 2], 1>>,

    AssertExact<[], Splice<[1, 2], 0, 2>>,
    AssertExact<readonly [], Splice<readonly [1, 2], 0, 2>>,

    AssertExact<[2?], Splice<[1, 2?], 0>>,
    AssertExact<readonly [2?], Splice<readonly [1, 2?], 0>>,

    AssertExact<[1], Splice<[1, 2?], 1>>,
    AssertExact<readonly [1], Splice<readonly [1, 2?], 1>>,

    AssertExact<[1, 3?], Splice<[1, 2?, 3?], 1>>,
    AssertExact<readonly [1, 3?], Splice<readonly [1, 2?, 3?], 1>>,

    AssertExact<[1, 2], Splice<[1, 2], 2>>,
    AssertExact<readonly [1, 2], Splice<readonly [1, 2], 2>>,

    AssertExact<[], Splice<[1, 2], 0, number>>,
    AssertExact<readonly [], Splice<readonly [1, 2], 0, number>>,

    AssertExact<[2, ...3[]], Splice<[1, 2, ...3[]], 0>>,
    AssertExact<readonly [2, ...3[]], Splice<readonly [1, 2, ...3[]], 0>>,

    AssertExact<[1, 2, ...3[]], Splice<[1, 2, ...3[]], 0, 0>>,
    AssertExact<readonly [1, 2, ...3[]], Splice<readonly [1, 2, ...3[]], 0, 0>>,

    AssertExact<[2, ...3[]], Splice<[1, 2, ...3[]], 0, 1>>,
    AssertExact<readonly [2, ...3[]], Splice<readonly [1, 2, ...3[]], 0, 1>>,

    AssertExact<3[], Splice<[1, 2, ...3[]], 0, 2>>,
    AssertExact<readonly 3[], Splice<readonly [1, 2, ...3[]], 0, 2>>,

];
