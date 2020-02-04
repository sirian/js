import {AssertExact, Func, InverseTypeGuard, TypeGuard} from "../../src";

type X = number | "foo" | "bar";

type Test = [
    AssertExact<InverseTypeGuard<TypeGuard<"foo", X>>, (value: number | "foo" | "bar") => value is "bar" | number>,
    AssertExact<InverseTypeGuard<TypeGuard<number, X>>, (value: number | "foo" | "bar") => value is "foo" | "bar">,
    AssertExact<InverseTypeGuard<TypeGuard<X, X>>, (value: number | "foo" | "bar") => value is never>,
    AssertExact<TypeGuard<never>, (value: number | string) => value is never>,
    AssertExact<InverseTypeGuard<TypeGuard<number, number | string>>, (value: number | string) => value is string>,
    AssertExact<InverseTypeGuard<Func<number, [boolean, string]>>, (x: boolean, y: string) => boolean>
];
