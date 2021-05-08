import {AssertExact, Ctor, Func, ObjectTag} from "../../src";

type Test = [
    AssertExact<"Boolean", ObjectTag<true>>,
    AssertExact<"Boolean", ObjectTag<boolean>>,

    AssertExact<"String", ObjectTag<"42">>,
    AssertExact<"String", ObjectTag<string>>,

    AssertExact<"Number", ObjectTag<42>>,
    AssertExact<"Number", ObjectTag<number>>,

    AssertExact<"BigInt", ObjectTag<1n>>,
    AssertExact<"BigInt", ObjectTag<bigint>>,

    AssertExact<"Symbol", ObjectTag<symbol>>,

    AssertExact<"Undefined", ObjectTag<undefined>>,
    AssertExact<"Undefined", ObjectTag<void>>,

    AssertExact<"Null", ObjectTag<null>>,

    AssertExact<"Function", ObjectTag<FunctionConstructor>>,
    AssertExact<"Function", ObjectTag<Function>>,
    AssertExact<"Function", ObjectTag<Func>>,
    AssertExact<"Function", ObjectTag<Ctor>>,
    AssertExact<"Function", ObjectTag<() => true>>,

    AssertExact<"Object", ObjectTag<{}>>,
    AssertExact<"Object", ObjectTag<{ x: 1 }>>,
    AssertExact<"Object", ObjectTag<{ [id: number]: any }>>,
    AssertExact<"Object", ObjectTag<Record<string, any>>>,
    AssertExact<"Object", ObjectTag<object>>,

    AssertExact<"Array", ObjectTag<[]>>,
    AssertExact<"Array", ObjectTag<[1]>>,
    AssertExact<"Array", ObjectTag<number[]>>,

    AssertExact<"Error", ObjectTag<Error>>,
    AssertExact<"Date", ObjectTag<Date>>,
    AssertExact<"RegExp", ObjectTag<RegExp>>,

    AssertExact<"Int8Array", ObjectTag<Int8Array>>,
    AssertExact<"Int16Array", ObjectTag<Int16Array>>,
    AssertExact<"Int32Array", ObjectTag<Int32Array>>,
    // todo: typo in typescript lib AssertExact<"Uint8Array", ObjectTag<Uint8Array>>,
    AssertExact<"Uint8ClampedArray", ObjectTag<Uint8ClampedArray>>,
    AssertExact<"Uint16Array", ObjectTag<Uint16Array>>,
    AssertExact<"Uint32Array", ObjectTag<Uint32Array>>,
    AssertExact<"Float32Array", ObjectTag<Float32Array>>,
    AssertExact<"Float64Array", ObjectTag<Float64Array>>,

    AssertExact<never, ObjectTag<never>>
];

export default Test;
