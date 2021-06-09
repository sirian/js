import {AssertExact, Ctor, ExtractFunction, Func, Instance, Predicate} from "../../src";

type Foo = 3 | boolean | (() => 1) | { x: 1 } | null;

type CallableInstance = { foo: string } & ((x: number) => 42);
type CallableInstanceCtor = new (bar: any) => CallableInstance;

declare class Baz {}

declare type Test = [
    AssertExact<(() => 1), ExtractFunction<Foo>>,
    AssertExact<typeof Baz, ExtractFunction<typeof Baz>>,
    AssertExact<never, ExtractFunction<Baz>>,
    AssertExact<never, ExtractFunction<object>>,
    AssertExact<Func | Ctor, ExtractFunction<Func | Ctor | {}>>,
    AssertExact<Func | Ctor, ExtractFunction<Func | Ctor | object>>,
    AssertExact<Func | Ctor, ExtractFunction<Func | Ctor | Record<string, any>>>,
    AssertExact<Predicate, ExtractFunction<Predicate | null | undefined>>,
    AssertExact<CallableFunction | NewableFunction, ExtractFunction<CallableFunction | NewableFunction>>,
    AssertExact<DateConstructor, ExtractFunction<Date | DateConstructor>>,
    AssertExact<Function | FunctionConstructor, ExtractFunction<Function | FunctionConstructor>>,
    AssertExact<never, ExtractFunction<Date | RegExp>>,
    AssertExact<CallableInstance, ExtractFunction<CallableInstance>>,
    AssertExact<GeneratorFunction, ExtractFunction<GeneratorFunction>>,
    AssertExact<GeneratorFunctionConstructor, ExtractFunction<GeneratorFunctionConstructor>>,
    AssertExact<CallableInstanceCtor, ExtractFunction<CallableInstanceCtor>>,
    AssertExact<CallableInstance, ExtractFunction<Instance<CallableInstanceCtor>>>
];
