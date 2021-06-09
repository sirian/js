import {AssertExact, Func, RequiredKeys} from "../../src";

declare type Test = [
    AssertExact<never, RequiredKeys<null>>,
    AssertExact<never, RequiredKeys<undefined>>,
    AssertExact<never, RequiredKeys<{}>>,
    AssertExact<never, RequiredKeys<Func>>,
    AssertExact<"x", RequiredKeys<{ x: string }>>,
    AssertExact<1, RequiredKeys<{ 0?: 0, 1: 1, 2?: 2 }>>,
    AssertExact<"x", RequiredKeys<{ x: undefined }>>,
    AssertExact<never, RequiredKeys<{ x?: string }>>,
    AssertExact<never, RequiredKeys<{ x?: undefined }>>,
    AssertExact<"foo" | "bar", RequiredKeys<Record<"foo" | "bar", any>>>,
    AssertExact<"y", RequiredKeys<{ x?: string, y: number, z?: string }>>
];
