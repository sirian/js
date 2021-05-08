import {AnyType, AssertExact, Ctor, Func, NotFunc, TypeName, TypeNameOf} from "../../src";

type Test = [
    AssertExact<"boolean", TypeNameOf<true>>,
    AssertExact<"boolean", TypeNameOf<boolean>>,

    AssertExact<"string", TypeNameOf<"42">>,
    AssertExact<"string", TypeNameOf<string>>,

    AssertExact<"number", TypeNameOf<42>>,
    AssertExact<"number", TypeNameOf<number>>,

    AssertExact<"bigint", TypeNameOf<1n>>,
    AssertExact<"bigint", TypeNameOf<bigint>>,

    AssertExact<"symbol", TypeNameOf<symbol>>,

    AssertExact<"undefined", TypeNameOf<undefined>>,
    AssertExact<"undefined", TypeNameOf<void>>,

    AssertExact<"function", TypeNameOf<FunctionConstructor>>,

    AssertExact<"function", TypeNameOf<Function>>,

    AssertExact<"function", TypeNameOf<Func>>,

    AssertExact<"function", TypeNameOf<Ctor>>,

    AssertExact<"function", TypeNameOf<() => true>>,

    AssertExact<"object", TypeNameOf<null>>,

    AssertExact<"object", TypeNameOf<{}>>,
    AssertExact<"object", TypeNameOf<{ x: 1 }>>,
    AssertExact<"object", TypeNameOf<object>>,

    AssertExact<"object", TypeNameOf<[]>>,
    AssertExact<"object", TypeNameOf<[1]>>,
    AssertExact<"object", TypeNameOf<number[]>>,

    AssertExact<"boolean" | "function", TypeNameOf<boolean | (() => any)>>,

    AssertExact<TypeName, TypeNameOf<AnyType>>,
    AssertExact<Exclude<TypeName, "function">, TypeNameOf<NotFunc>>,
    AssertExact<never, TypeNameOf<never>>
];

export default Test;
