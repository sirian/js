import {AssertExact, Tail} from "../../src";

declare type Test = [
    AssertExact<Tail<[]>, []>,
    AssertExact<Tail<readonly []>, readonly []>,

    AssertExact<Tail<[1]>, []>,
    AssertExact<Tail<readonly [1]>, readonly []>,

    AssertExact<Tail<[1?]>, []>,
    AssertExact<Tail<readonly [1?]>, readonly []>,

    AssertExact<Tail<[1, 2]>, [2]>,
    AssertExact<Tail<readonly [1, 2]>, readonly [2]>,

    AssertExact<Tail<[1, 2?]>, [2?]>,
    AssertExact<Tail<readonly [1, 2?]>, readonly [2?]>,

    AssertExact<Tail<[1?, 2?]>, [2?]>,
    AssertExact<Tail<readonly [1?, 2?]>, readonly [2?]>,

    AssertExact<Tail<[1, 2, 3?]>, [2, 3?]>,
    AssertExact<Tail<readonly [1, 2, 3?]>, readonly [2, 3?]>,

    AssertExact<Tail<[1, 3?]>, [3?]>,
    AssertExact<Tail<readonly [1, 3?]>, readonly [3?]>,

    AssertExact<Tail<[1, 2 | 3]>, [2 | 3]>,
    AssertExact<Tail<readonly [1, 2 | 3]>, readonly [2 | 3]>,

    AssertExact<Tail<[1, 2, 3]>, [2, 3]>,
    AssertExact<Tail<readonly [1, 2, 3]>, readonly [2, 3]>,

    AssertExact<Tail<[1, 3, ...1[]]>, [3, ...1[]]>,
    AssertExact<Tail<readonly [1, 3, ...1[]]>, readonly [3, ...1[]]>,

    AssertExact<Tail<[1, 1, ...1[]]>, [1, ...1[]]>,
    AssertExact<Tail<readonly [1, 1, ...1[]]>, readonly [1, ...1[]]>,

    AssertExact<Tail<[1, ...1[]]>, 1[]>,
    AssertExact<Tail<readonly [1, ...1[]]>, readonly 1[]>,

    AssertExact<Tail<1[]>, 1[]>,
    AssertExact<Tail<readonly 1[]>, readonly 1[]>,
];
