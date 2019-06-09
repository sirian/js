import {AssertExact, Reverse} from "../../src";

type Test = [
    AssertExact<[], Reverse<[]>>,
    AssertExact<[number], Reverse<[number]>>,
    AssertExact<[number | string, 1], Reverse<[1, number | string]>>,
    AssertExact<number[], Reverse<number[]>>,
    AssertExact<Array<string | number>, Reverse<[string, ...number[]]>>,

    AssertExact<[string, number], Reverse<[number, string]>>,
    AssertExact<never, Reverse<[1, 2?]>>,
    AssertExact<[3 | undefined, 2, 1], Reverse<[1, 2, 3 | undefined]>>,
    AssertExact<never, Reverse<[1, 2, 3?]>>,
    AssertExact<[1 | undefined], Reverse<[1 | undefined]>>,
    AssertExact<[2, 1 | undefined], Reverse<[1 | undefined, 2]>>,
    AssertExact<[2, 1 | undefined, 0], Reverse<[0, 1 | undefined, 2]>>,
    AssertExact<[1?], Reverse<[1?]>>,
    AssertExact<[2?, 1?], Reverse<[1?, 2?]>>,
    AssertExact<[3?, 2?, 1?], Reverse<[1?, 2?, 3?]>>,
    AssertExact<never, Reverse<[1, 2?]>>,
    AssertExact<[3 | undefined, 2 | undefined, 1 | undefined], Reverse<[1 | undefined, 2 | undefined, 3 | undefined]>>,

    AssertExact<[string, string], Reverse<[string, string]>>,

    AssertExact<[string, string | number], Reverse<[string | number, string]>>,

    AssertExact<[string | boolean, number, boolean, void], Reverse<[void, boolean, number, string | boolean]>>
];
