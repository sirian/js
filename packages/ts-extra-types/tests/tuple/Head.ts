import {AssertExact, Head} from "../../src";

type Test = [
    AssertExact<undefined, Head<[]>>,

    AssertExact<number | undefined, Head<number[]>>,

    AssertExact<1, Head<[1]>>,
    AssertExact<1, Head<readonly [1]>>,
    AssertExact<1 | undefined, Head<[1?]>>,
    AssertExact<1 | undefined, Head<readonly [1?]>>,
    AssertExact<1, Head<[1, 2?]>>,
    AssertExact<1, Head<readonly [1, 2?]>>,
    AssertExact<1 | undefined, Head<[1?, 2?]>>,
    AssertExact<1 | undefined, Head<readonly [1?, 2?]>>,

    AssertExact<string | boolean, Head<[string | boolean, number]>>,

    AssertExact<number, Head<[number, string, boolean]>>
];
