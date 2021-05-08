import {AssertExact, ToPrimitive} from "../../src";

type Test = [
    AssertExact<number, ToPrimitive<number>>,
    AssertExact<string, ToPrimitive<string>>,
    AssertExact<undefined, ToPrimitive<undefined>>,
    AssertExact<null, ToPrimitive<null>>,
    AssertExact<bigint, ToPrimitive<bigint>>,
    AssertExact<symbol, ToPrimitive<symbol>>,
    AssertExact<boolean, ToPrimitive<boolean>>,
    AssertExact<true, ToPrimitive<true>>,
    AssertExact<never, ToPrimitive<object>>,
    AssertExact<never, ToPrimitive<() => any>>,

    AssertExact<number, ToPrimitive<Number>>,
    AssertExact<string, ToPrimitive<String>>,
    AssertExact<bigint, ToPrimitive<BigInt>>,
    AssertExact<symbol, ToPrimitive<Symbol>>,
    AssertExact<boolean, ToPrimitive<Boolean>>,

    AssertExact<boolean, ToPrimitive<{ [Symbol.toPrimitive](): boolean }>>,
    AssertExact<boolean, ToPrimitive<{ [Symbol.toPrimitive](): boolean, valueOf(): number }>>,
    AssertExact<number, ToPrimitive<{ valueOf(): number | object }>>,

    AssertExact<boolean | number, ToPrimitive<{ [Symbol.toPrimitive](): boolean | number }>>,

    AssertExact<string | number, ToPrimitive<Date>>
];
