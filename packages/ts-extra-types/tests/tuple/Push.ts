import {AssertExact, Push} from "../../src";

type Test = [
    AssertExact<[1], Push<[], 1>>,

    AssertExact<[1, 2], Push<[1], 2>>,

    AssertExact<[1 | undefined, 2], Push<[1?], 2>>,

    AssertExact<number[], Push<number[], string>>
];
