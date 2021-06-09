import {AssertExact, Widen} from "../../src";

declare type Test = [
    AssertExact<number, Widen<3>>,
    AssertExact<number, Widen<number>>,
    AssertExact<bigint, Widen<3n>>,
    AssertExact<bigint, Widen<bigint>>,
    AssertExact<string, Widen<"foo">>,
    AssertExact<string, Widen<string>>,
    AssertExact<boolean, Widen<true>>,
    AssertExact<boolean, Widen<boolean>>,
    AssertExact<symbol, Widen<symbol>>,
    AssertExact<null, Widen<null>>,
    AssertExact<undefined, Widen<undefined>>,
    AssertExact<void, Widen<void>>,
    AssertExact<unknown, Widen<unknown>>,
    AssertExact<never, Widen<never>>,
    AssertExact<(x: number) => any, Widen<(x: number) => any>>,
    AssertExact<{ x: 1 }, Widen<{ x: 1 }>>,
    AssertExact<Number, Widen<Number>>
];
