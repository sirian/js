import {
    AnyFunc,
    AnyType,
    AssertExact,
    AsyncFunc,
    Ctor,
    Func,
    NotFunc,
    SyncFunc,
    XTypeName,
    XTypeNameOf,
} from "../../src";

declare type Test = [
    AssertExact<"boolean", XTypeNameOf<true>>,
    AssertExact<"boolean", XTypeNameOf<boolean>>,

    AssertExact<"string", XTypeNameOf<"42">>,
    AssertExact<"string", XTypeNameOf<string>>,

    AssertExact<"number", XTypeNameOf<42>>,
    AssertExact<"number", XTypeNameOf<number>>,

    AssertExact<"bigint", XTypeNameOf<1n>>,
    AssertExact<"bigint", XTypeNameOf<bigint>>,

    AssertExact<"symbol", XTypeNameOf<symbol>>,

    AssertExact<"undefined", XTypeNameOf<undefined>>,
    AssertExact<"undefined", XTypeNameOf<void>>,

    AssertExact<"function", XTypeNameOf<FunctionConstructor>>,
    AssertExact<"function", XTypeNameOf<Function>>,
    AssertExact<"function", XTypeNameOf<Func>>,
    AssertExact<"function", XTypeNameOf<AsyncFunc>>,
    AssertExact<"function", XTypeNameOf<SyncFunc>>,
    AssertExact<"function", XTypeNameOf<AnyFunc>>,
    AssertExact<"function", XTypeNameOf<Ctor>>,
    AssertExact<"function", XTypeNameOf<() => true>>,

    AssertExact<"null", XTypeNameOf<null>>,

    AssertExact<"object", XTypeNameOf<{}>>,
    AssertExact<"object", XTypeNameOf<ArrayLike<any>>>,
    AssertExact<"object", XTypeNameOf<Record<string, any>>>,
    AssertExact<"object", XTypeNameOf<{ [id: string]: any }>>,
    AssertExact<"object", XTypeNameOf<{ x: 1 }>>,
    AssertExact<"object", XTypeNameOf<object>>,

    AssertExact<"array", XTypeNameOf<[]>>,
    AssertExact<"array", XTypeNameOf<[1]>>,
    AssertExact<"array", XTypeNameOf<number[]>>,

    AssertExact<"boolean" | "function", XTypeNameOf<boolean | (() => any)>>,

    AssertExact<XTypeName, XTypeNameOf<AnyType>>,
    AssertExact<Exclude<XTypeName, "function">, XTypeNameOf<NotFunc>>,
    AssertExact<never, XTypeNameOf<never>>
];
