import {AnyType, AssertExact, ExtractByTypeName, TypeName} from "../../src";

type Fn = (() => void);
type Class = PromiseConstructor;
type Foo = 3 | boolean | Fn | Class | { x: 1 } | number[] | null | void;
type Bar = undefined | null | void | 2n;

type Ex<V, T extends TypeName> = ExtractByTypeName<V, T>;

declare type Test = [
    AssertExact<never, Ex<Foo, "string">>,
    AssertExact<{ x: 1 } | null | number[], Ex<Foo, "object">>,
    AssertExact<Fn | Class, Ex<Foo, "function">>,

    AssertExact<void, Ex<Foo, "undefined">>,

    AssertExact<3, Ex<Foo, "number">>,
    AssertExact<never, Ex<Foo, "symbol">>,
    AssertExact<never, Ex<Foo, "bigint">>,

    AssertExact<null, Ex<Bar, "object">>,

    AssertExact<undefined | void, Ex<Bar, "undefined">>,
    AssertExact<2n, Ex<Bar, "bigint">>,

    AssertExact<string, Ex<AnyType, "string">>,
    AssertExact<AnyType, Ex<AnyType, TypeName>>,
    AssertExact<never, Ex<AnyType, never>>,
    AssertExact<never, Ex<never, TypeName>>
];
