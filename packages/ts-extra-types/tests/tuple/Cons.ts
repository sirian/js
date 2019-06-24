import {AssertExact, Cons} from "../../src";

type Test = [
    AssertExact<[1], Cons<1, []>>,
    AssertExact<[1?], Cons<1, [], true>>,

    AssertExact<[1, 2], Cons<1, [2]>>,
    AssertExact<[1 | undefined, 2], Cons<1, [2], true>>,

    AssertExact<[1, 2?], Cons<1, [2?]>>,
    AssertExact<[1?, 2?], Cons<1, [2?], true>>,

    AssertExact<[3, 2], Cons<3, [2]>>,

    AssertExact<[1, ...2[]], Cons<1, 2[]>>,

    AssertExact<[1, ...1[]], Cons<1, 1[]>>
];
