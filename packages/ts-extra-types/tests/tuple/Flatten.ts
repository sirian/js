import {AssertExact, Flatten} from "../../src";

type Test = [
    AssertExact<[1, 2, 3, 4], Flatten<[1, 2, 3, 4]>>,
    AssertExact<readonly [1, 2, 3, 4], Flatten<readonly [1, 2, 3, 4]>>,

    AssertExact<[1, 2, 3, 4, 5, 6, 7], Flatten<[1, [2, [], [3], 4, [[[5], [6], [[7]]]]]]>>,
    AssertExact<readonly [1, 2, 3, 4, 5, 6, 7], Flatten<readonly [1, [2, [], [3], 4, [[[5], [6], [[7]]]]]]>>,

    AssertExact<[1, 2, ...3[]], Flatten<[1, 2, ...3[]]>>,
    AssertExact<readonly [1, 2, ...3[]], Flatten<readonly [1, 2, ...3[]]>>,

    AssertExact<[1, 2, ...3[]], Flatten<[1, 2, ...3[][]]>>,
    AssertExact<readonly [1, 2, ...3[]], Flatten<readonly [1, 2, ...3[][]]>>,

    AssertExact<[1, 2, ...[3, 4, 5, 6, 7][]], Flatten<[1, 2, ...[3, [4, [5, 6]], 7][][]]>>,
    AssertExact<readonly [1, 2, ...[3, 4, 5, 6, 7][]], Flatten<readonly [1, 2, ...[3, [4, [5, 6]], 7][][]]>>,

    AssertExact<1[], Flatten<1[]>>,
    AssertExact<readonly 1[], Flatten<readonly 1[]>>,

    AssertExact<1[], Flatten<1[][]>>,
    AssertExact<readonly 1[], Flatten<readonly 1[][]>>,

    AssertExact<1[], Flatten<1[][][]>>,
    AssertExact<readonly 1[], Flatten<readonly 1[][][]>>,

    AssertExact<1[] | 2[], Flatten<1[] | 2[]>>,
    AssertExact<readonly 1[] | readonly 2[], Flatten<readonly 1[] | readonly 2[]>>,

    AssertExact<(1 | 2)[], Flatten<(1[] | 2[][])[][]>>,
    AssertExact<readonly (1 | 2)[], Flatten<readonly (1[] | 2[][])[][]>>,
];
