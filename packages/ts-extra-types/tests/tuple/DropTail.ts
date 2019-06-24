import {AssertExact, DropTail} from "../../src";

type Test = [
    AssertExact<[], DropTail<[]>>,
    AssertExact<[1], DropTail<[1]>>,
    AssertExact<[1?], DropTail<[1?]>>,
    AssertExact<[1], DropTail<[1, 2]>>,
    AssertExact<[1?], DropTail<[1?, 2?]>>,
    AssertExact<[1?], DropTail<1[]>>
];
