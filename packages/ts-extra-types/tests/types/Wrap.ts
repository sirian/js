import {AssertExact, Wrap} from "../../src";

type Test = [
    AssertExact<Number, Wrap<3>>,
    AssertExact<Number, Wrap<number>>,
    AssertExact<BigInt, Wrap<3n>>,
    AssertExact<BigInt, Wrap<bigint>>,
    AssertExact<String, Wrap<"foo">>,
    AssertExact<String, Wrap<string>>,
    AssertExact<Boolean, Wrap<true>>,
    AssertExact<Boolean, Wrap<boolean>>,
    AssertExact<Symbol, Wrap<symbol>>,
    AssertExact<object, Wrap<null>>,
    AssertExact<object, Wrap<undefined>>,
    AssertExact<unknown, Wrap<unknown>>,
    AssertExact<never, Wrap<never>>,
    AssertExact<(x: number) => any, Wrap<(x: number) => any>>,
    AssertExact<{ x: 1 }, Wrap<{ x: 1 }>>,
    AssertExact<Number, Wrap<Number>>,
    AssertExact<BigInt, Wrap<BigInt>>
];
