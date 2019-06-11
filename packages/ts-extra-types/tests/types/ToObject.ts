import {AssertExact, ToObject} from "../../src";

type Test = [
    AssertExact<Number, ToObject<3>>,
    AssertExact<Number, ToObject<number>>,
    AssertExact<BigInt, ToObject<3n>>,
    AssertExact<BigInt, ToObject<bigint>>,
    AssertExact<String, ToObject<"foo">>,
    AssertExact<String, ToObject<string>>,
    AssertExact<Boolean, ToObject<true>>,
    AssertExact<Boolean, ToObject<boolean>>,
    AssertExact<Symbol, ToObject<symbol>>,
    AssertExact<Object, ToObject<null>>,
    AssertExact<Object, ToObject<undefined>>,
    AssertExact<unknown, ToObject<unknown>>,
    AssertExact<never, ToObject<never>>,
    AssertExact<(x: number) => any, ToObject<(x: number) => any>>,
    AssertExact<{ x: 1 }, ToObject<{ x: 1 }>>,
    AssertExact<Number, ToObject<Number>>,
    AssertExact<BigInt, ToObject<BigInt>>
];
