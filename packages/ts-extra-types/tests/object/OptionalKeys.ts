import {AssertExact, Func, OptionalKeys} from "../../src";

declare type Test = [
    AssertExact<never, OptionalKeys<null>>,
    AssertExact<never, OptionalKeys<undefined>>,
    AssertExact<never, OptionalKeys<{}>>,
    AssertExact<never, OptionalKeys<Func>>,
    AssertExact<never, OptionalKeys<{ x: string }>>,
    AssertExact<0 | 2, OptionalKeys<{ 0?: 0, 1: 1, 2?: 2 }>>,
    AssertExact<0 | 2, OptionalKeys<{ 0?: 0, 1: 1, 2?: 2 }>>,
    AssertExact<never, OptionalKeys<{ x: undefined }>>,
    AssertExact<"x", OptionalKeys<{ x?: string }>>,
    AssertExact<"x", OptionalKeys<{ x?: undefined }>>,
    AssertExact<"foo" | "bar", OptionalKeys<Partial<Record<"foo" | "bar", any>>>>,
    AssertExact<string, OptionalKeys<Partial<Record<string, any>>>>,
    AssertExact<"x" | "z", OptionalKeys<{ x?: string, y: number, z?: string }>>
];
