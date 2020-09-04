import {AssertExact, Push} from "../../src";

type Test = [
    AssertExact<[1], Push<[], 1>>,

    AssertExact<[1, 2], Push<[1], 2>>,

    AssertExact<[1, 2?], Push<[1], 2, true>>,
    AssertExact<[1?, 2?], Push<[1?], 2, true>>,
    AssertExact<[1 | undefined, 2], Push<[1?], 2>>,

    AssertExact<Array<number | string>, Push<number[], string>>,
];
