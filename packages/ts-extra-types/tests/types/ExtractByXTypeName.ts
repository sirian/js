import {AnyType, AssertExact, ExtractByXTypeName, XTypeName} from "../../src";

type Fn = (() => void);
type Class = PromiseConstructor;
type Foo = 3 | boolean | Fn | Class | { x: 1 } | number[] | null | void;
type Bar = undefined | null | void | 2n;

type Test = [
    AssertExact<never, ExtractByXTypeName<Foo, "string">>,
    AssertExact<{ x: 1 }, ExtractByXTypeName<Foo, "object">>,
    AssertExact<Fn | Class, ExtractByXTypeName<Foo, "function">>,
    AssertExact<null, ExtractByXTypeName<Foo, "null">>,
    AssertExact<void, ExtractByXTypeName<Foo, "undefined">>,
    AssertExact<number[], ExtractByXTypeName<Foo, "array">>,
    AssertExact<3, ExtractByXTypeName<Foo, "number">>,
    AssertExact<never, ExtractByXTypeName<Foo, "symbol">>,
    AssertExact<never, ExtractByXTypeName<Foo, "bigint">>,

    AssertExact<never, ExtractByXTypeName<Bar, "object">>,
    AssertExact<null, ExtractByXTypeName<Bar, "null">>,
    AssertExact<undefined | void, ExtractByXTypeName<Bar, "undefined">>,
    AssertExact<2n, ExtractByXTypeName<Bar, "bigint">>,

    AssertExact<string, ExtractByXTypeName<AnyType, "string">>,
    AssertExact<AnyType, ExtractByXTypeName<AnyType, XTypeName>>,
    AssertExact<never, ExtractByXTypeName<AnyType, never>>,
    AssertExact<never, ExtractByXTypeName<never, XTypeName>>
];

export default Test;
