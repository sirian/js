import {AssertExact, DeepRequire} from "../../src";

type Test = [
    AssertExact<{}, DeepRequire<{}>>,
    AssertExact<{ x: number }, DeepRequire<{ x?: number }>>,
    AssertExact<{ x: number }, DeepRequire<{ x: number }>>,
    AssertExact<{ x: number, y: { z: number } }, DeepRequire<{ x?: number, y?: { z?: number } }>>,
    AssertExact<{ x: number, y: { z: number } }, DeepRequire<{ x?: number, y: { z?: number } }>>,
    AssertExact<{ x: number, y: { z: number } }, DeepRequire<{ x?: number, y?: { z: number } }>>,

    AssertExact<[], DeepRequire<[]>>,
    AssertExact<[1], DeepRequire<[1]>>,
    AssertExact<[1], DeepRequire<[1?]>>,
    AssertExact<[1, 2, [3, 4], 5], DeepRequire<[1?, 2?, [3?, 4?]?, 5?]>>,
];
