import {AssertExact, Reverse} from "../../src";

type U = undefined;

type Test = [
    AssertExact<[], Reverse<[]>>,
    AssertExact<[1], Reverse<[1]>>,
    AssertExact<[1?], Reverse<[1?]>>,
    AssertExact<[1 | 2, 1], Reverse<[1, 1 | 2]>>,
    AssertExact<1[], Reverse<1[]>>,
    AssertExact<[...2[], 1], Reverse<[1, ...2[]]>>,
    AssertExact<[...3[], 2, 1], Reverse<[1, 2, ...3[]]>>,
    AssertExact<[...1[], 1], Reverse<[1, ...1[]]>>,
    // AssertExact<1[], Reverse<[1?, ...1[]]>>,
    AssertExact<[...3[], 2 | U, 1], Reverse<[1, 2?, ...3[]]>>,

    AssertExact<[2, 1], Reverse<[1, 2]>>,
    AssertExact<[2 | U, 1], Reverse<[1, 2?]>>,
    AssertExact<[3 | U, 2, 1], Reverse<[1, 2, 3 | U]>>,
    AssertExact<[3 | U, 2, 1], Reverse<[1, 2, 3?]>>,
    AssertExact<[1 | U], Reverse<[1 | U]>>,
    AssertExact<[2, 1 | U], Reverse<[1 | U, 2]>>,
    AssertExact<[2, 1 | U, 0], Reverse<[0, 1 | U, 2]>>,
    AssertExact<[1?], Reverse<[1?]>>,
    AssertExact<[2?, 1?], Reverse<[1?, 2?]>>,
    AssertExact<[3?, 2?, 1?], Reverse<[1?, 2?, 3?]>>,
    AssertExact<[3 | U, 2 | U, 1 | U], Reverse<[1 | U, 2 | U, 3 | U]>>,

    AssertExact<[2, 2], Reverse<[2, 2]>>,

    AssertExact<[2, 2 | 1], Reverse<[2 | 1, 2]>>,

    AssertExact<[2 | 3, 1, 3, void], Reverse<[void, 3, 1, 2 | 3]>>
];
