import {AssertExact, Slice} from "../../src";

declare type Test = [
    AssertExact<[], Slice<[], 0, 0>>,
    AssertExact<readonly [], Slice<readonly [], 0, 0>>,

    AssertExact<[], Slice<[], 0, 1>>,
    AssertExact<readonly [], Slice<readonly [], 0, 1>>,

    AssertExact<[], Slice<[], 1, 1>>,
    AssertExact<readonly [], Slice<readonly [], 1, 1>>,

    AssertExact<[], Slice<[1], 0, 0>>,
    AssertExact<readonly [], Slice<readonly [1], 0, 0>>,

    AssertExact<[1], Slice<[1], 0, 1>>,
    AssertExact<readonly [1], Slice<readonly [1], 0, 1>>,

    AssertExact<[], Slice<[1], 1, 1>>,
    AssertExact<readonly [], Slice<readonly [1], 1, 1>>,

    AssertExact<[1, 2, 3], Slice<[1, 2, 3]>>,
    AssertExact<readonly [1, 2, 3], Slice<readonly [1, 2, 3]>>,

    AssertExact<[1, 2, 3], Slice<[1, 2, 3], 0>>,
    AssertExact<readonly [1, 2, 3], Slice<readonly [1, 2, 3], 0>>,

    AssertExact<[2, 3], Slice<[1, 2, 3], 1>>,
    AssertExact<readonly [2, 3], Slice<readonly [1, 2, 3], 1>>,

    AssertExact<[3], Slice<[1, 2, 3], 2>>,
    AssertExact<readonly [3], Slice<readonly [1, 2, 3], 2>>,

    AssertExact<[], Slice<[1, 2, 3], 3>>,
    AssertExact<readonly [], Slice<readonly [1, 2, 3], 3>>,

    AssertExact<[2], Slice<[1, 2, 3], 1, 1>>,
    AssertExact<readonly [2], Slice<readonly [1, 2, 3], 1, 1>>,

    AssertExact<[2, 3], Slice<[1, 2, 3], 1, 2>>,
    AssertExact<readonly [2, 3], Slice<readonly [1, 2, 3], 1, 2>>,

    AssertExact<[2, 3], Slice<[1, 2, 3], 1, 3>>,
    AssertExact<readonly [2, 3], Slice<readonly [1, 2, 3], 1, 3>>,

    AssertExact<[1, 2, 3], Slice<[1, 2, 3], 0, 3>>,
    AssertExact<readonly [1, 2, 3], Slice<readonly [1, 2, 3], 0, 3>>,

    AssertExact<[1, 2, 3], Slice<[1, 2, 3], 0, 3>>,
    AssertExact<readonly [1, 2, 3], Slice<readonly [1, 2, 3], 0, 3>>,

    AssertExact<[6], Slice<[1, 2, 3, 4, 5, 6], 5, 2>>,
    AssertExact<readonly [6], Slice<readonly [1, 2, 3, 4, 5, 6], 5, 2>>,

    AssertExact<[4, 5, 6], Slice<[1, 2, 3, 4, 5, 6], 3>>,
    AssertExact<readonly [4, 5, 6], Slice<readonly [1, 2, 3, 4, 5, 6], 3>>,

];
