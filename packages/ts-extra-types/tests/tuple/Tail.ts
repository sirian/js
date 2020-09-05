import {AssertExact, Tail} from "../../src";

type Test = [
    AssertExact<Tail<[]>, []>,
    AssertExact<Tail<[1]>, []>,
    AssertExact<Tail<[1?]>, []>,
    AssertExact<Tail<[1, 2]>, [2]>,
    AssertExact<Tail<[1, 2?]>, [2?]>,
    AssertExact<Tail<[1?, 2?]>, [2?]>,
    AssertExact<Tail<[1, 2, 3?]>, [2, 3?]>,
    AssertExact<Tail<[1, 3?]>, [3?]>,
    AssertExact<Tail<[1, 2 | 3]>, [2 | 3]>,
    AssertExact<Tail<[1, 2, 3]>, [2, 3]>,
    AssertExact<Tail<[1, 3, ...1[]]>, [3, ...1[]]>,
    AssertExact<Tail<[1, 1, ...1[]]>, [1, ...1[]]>,
    AssertExact<Tail<[1, ...1[]]>, 1[]>,
    AssertExact<Tail<1[]>, 1[]>
];
