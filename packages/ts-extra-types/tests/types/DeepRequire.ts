import {AssertExact, DeepRequire} from "../../src";

type Test = [
    AssertExact<{}, DeepRequire<{}>>,
    AssertExact<{ x: number }, DeepRequire<{ x?: number }>>,
    AssertExact<{ x: number }, DeepRequire<{ x?: number }>>,
    AssertExact<{ x: number | null }, DeepRequire<{ x?: number | null }>>,
    AssertExact<{ x: number | null | undefined }, DeepRequire<{ x: number | null | undefined }>>,
    AssertExact<{ x: number | null }, DeepRequire<{ x?: number | null | undefined }>>,
    AssertExact<{ x: number | undefined }, DeepRequire<{ x: number | undefined }>>,
    AssertExact<{ x: number }, DeepRequire<{ x?: number | undefined }>>
];
