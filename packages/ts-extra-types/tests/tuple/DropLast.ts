import {AssertExact, DropLast} from "../../src";

type Test = [
    AssertExact<[], DropLast<[]>>,
    AssertExact<[], DropLast<[1]>>,
    AssertExact<[], DropLast<[1?]>>,
    AssertExact<[1?], DropLast<[1?, 2?]>>,
    AssertExact<[1], DropLast<[1, 2?]>>,
    AssertExact<[1, 2?], DropLast<[1, 2?, 3?]>>,
    AssertExact<[1], DropLast<[1, 2]>>,
    AssertExact<[1, 2], DropLast<[1, 2, 3]>>,
    AssertExact<1[], DropLast<1[]>>,
    AssertExact<[1, 2, ...3[]], DropLast<[1, 2, ...3[]]>>,
    AssertExact<[2, ...1[]], DropLast<[2, ...1[]]>>,
];
