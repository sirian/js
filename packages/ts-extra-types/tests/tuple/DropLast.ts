import {AssertExact, DropLast} from "../../src";

declare type Test = [
    AssertExact<[], DropLast<[]>>,
    AssertExact<readonly [], DropLast<readonly []>>,

    AssertExact<[], DropLast<[1]>>,
    AssertExact<readonly [], DropLast<readonly [1]>>,

    AssertExact<[], DropLast<[1?]>>,
    AssertExact<readonly [], DropLast<readonly [1?]>>,

    AssertExact<[1?], DropLast<[1?, 2?]>>,
    AssertExact<readonly [1?], DropLast<readonly [1?, 2?]>>,

    AssertExact<[1], DropLast<[1, 2?]>>,
    AssertExact<readonly [1], DropLast<readonly [1, 2?]>>,

    AssertExact<[1, 2?], DropLast<[1, 2?, 3?]>>,
    AssertExact<readonly [1, 2?], DropLast<readonly [1, 2?, 3?]>>,

    AssertExact<[1], DropLast<[1, 2]>>,
    AssertExact<readonly [1], DropLast<readonly [1, 2]>>,

    AssertExact<[1, 2], DropLast<[1, 2, 3]>>,
    AssertExact<readonly [1, 2], DropLast<readonly [1, 2, 3]>>,

    AssertExact<1[], DropLast<1[]>>,
    AssertExact<readonly 1[], DropLast<readonly 1[]>>,

    AssertExact<[1, 2, ...3[]], DropLast<[1, 2, ...3[]]>>,
    AssertExact<readonly [1, 2, ...3[]], DropLast<readonly [1, 2, ...3[]]>>,

    AssertExact<[2, ...1[]], DropLast<[2, ...1[]]>>,
    AssertExact<readonly [2, ...1[]], DropLast<readonly [2, ...1[]]>>,
];
