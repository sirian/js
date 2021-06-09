import {AssertExact, Head} from "../../src";

declare type Test = [
    AssertExact<undefined, Head<[]>>,
    AssertExact<undefined, Head<readonly []>>,

    AssertExact<number | undefined, Head<number[]>>,
    AssertExact<number | undefined, Head<readonly number[]>>,

    AssertExact<1, Head<[1]>>,
    AssertExact<1, Head<readonly [1]>>,

    AssertExact<1 | undefined, Head<[1?]>>,
    AssertExact<1 | undefined, Head<readonly [1?]>>,

    AssertExact<1, Head<[1, 2?]>>,
    AssertExact<1, Head<readonly [1, 2?]>>,

    AssertExact<1 | undefined, Head<[1?, 2?]>>,
    AssertExact<1 | undefined, Head<readonly [1?, 2?]>>,

    AssertExact<string | boolean, Head<[string | boolean, number]>>,
    AssertExact<string | boolean, Head<readonly [string | boolean, number]>>,

    AssertExact<number, Head<[number, string, boolean]>>,
    AssertExact<number, Head<readonly [number, string, boolean]>>,

];
