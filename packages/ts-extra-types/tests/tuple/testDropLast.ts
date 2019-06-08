import {AssertExact, DropLast} from "../../src";

type Test = [
    AssertExact<[], DropLast<[]>>,
    AssertExact<[], DropLast<[number]>>,
    AssertExact<[number], DropLast<[number, string?]>>,
    // AssertExact<[number, string?], DropLast<[number, string?, boolean?]>>,
    AssertExact<[number], DropLast<[number, string]>>,
    AssertExact<[number, string], DropLast<[number, string, boolean]>>,
    AssertExact<number[], DropLast<number[]>>
    // AssertExact<[string, ...number[]], DropLast<[string, ...number[]]>>,
];
