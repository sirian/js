import {AssertExact, ExtractByObjectTag} from "../../src";

type Fn = (() => void);
type Class = PromiseConstructor;
type Foo = 3 | boolean | Fn | Class | { x: 1 } | number[] | null | void;
type Bar = undefined | null | void | 2n;

type Test = [
    AssertExact<never, ExtractByObjectTag<Foo, "String">>,
    AssertExact<{ x: 1 }, ExtractByObjectTag<Foo, "Object">>,
    AssertExact<Fn | Class, ExtractByObjectTag<Foo, "Function">>,
    AssertExact<null, ExtractByObjectTag<Foo, "Null">>,
    AssertExact<void, ExtractByObjectTag<Foo, "Undefined">>,
    AssertExact<number[], ExtractByObjectTag<Foo, "Array">>,
    AssertExact<3, ExtractByObjectTag<Foo, "Number">>,
    AssertExact<never, ExtractByObjectTag<Foo, "Symbol">>,
    AssertExact<never, ExtractByObjectTag<Foo, "BigInt">>,

    AssertExact<never, ExtractByObjectTag<Bar, "Object">>,
    AssertExact<null, ExtractByObjectTag<Bar, "Null">>,
    AssertExact<undefined | void, ExtractByObjectTag<Bar, "Undefined">>,
    AssertExact<2n, ExtractByObjectTag<Bar, "BigInt">>,
];

export default Test;
