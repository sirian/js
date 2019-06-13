import {AssertExact, DeepRequire} from "../../src";

type Test = [
    AssertExact<{}, DeepRequire<{}>>,
    AssertExact<{ x: number }, DeepRequire<{ x?: number }>>,
    AssertExact<{ x: number }, DeepRequire<{ x?: number | null }>>,
    AssertExact<{ x: number }, DeepRequire<{ x: number | null }>>,
    AssertExact<{ x: number }, DeepRequire<{ x: number | undefined }>>,
    AssertExact<{ x: number }, DeepRequire<{ x?: number | undefined }>>
];
