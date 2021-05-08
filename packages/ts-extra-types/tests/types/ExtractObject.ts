import {AnyFunc, AssertExact, Ctor, ExtractObject, Func, Instance, Predicate} from "../../src";

type Foo = 3 | boolean | (() => 1) | { x: 1 } | null;

type CallableInstance = { foo: string } & ((x: number) => 42);
type CallableInstanceCtor = new (bar: any) => CallableInstance;

declare class Baz {}

type Test = [
    AssertExact<{ x: 1 }, ExtractObject<Foo>>,
    AssertExact<never, ExtractObject<typeof Baz>>,
    AssertExact<Baz, ExtractObject<Baz>>,
    AssertExact<object, ExtractObject<object>>,
    AssertExact<never, ExtractObject<AnyFunc>>,
    AssertExact<{}, ExtractObject<Func | Ctor | {}>>,
    AssertExact<object, ExtractObject<Func | Ctor | object>>,
    AssertExact<Record<string, any>, ExtractObject<Func | Ctor | Record<string, any>>>,
    AssertExact<never, ExtractObject<Predicate | null | undefined>>,
    AssertExact<never, ExtractObject<CallableFunction | NewableFunction>>,
    AssertExact<Date, ExtractObject<Date | DateConstructor>>,
    AssertExact<never, ExtractObject<Function | FunctionConstructor>>,
    AssertExact<Date | RegExp, ExtractObject<Date | RegExp>>,
    AssertExact<never, ExtractObject<CallableInstance>>,
    AssertExact<never, ExtractObject<GeneratorFunction>>,
    AssertExact<never, ExtractObject<GeneratorFunctionConstructor>>,
    AssertExact<never, ExtractObject<CallableInstanceCtor>>,
    AssertExact<never, ExtractObject<Instance<CallableInstanceCtor>>>
];
