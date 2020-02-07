import {AssertExact, NegatePredicate, TypeGuard} from "../../src";

type X = number | "foo" | "bar";

type Test = [
    AssertExact<NegatePredicate<TypeGuard<"foo", X>>, (value: number | "foo" | "bar") => value is "bar" | number>,
    AssertExact<NegatePredicate<TypeGuard<number, X>>, (value: number | "foo" | "bar") => value is "foo" | "bar">,
    AssertExact<NegatePredicate<TypeGuard<X, X>>, (value: number | "foo" | "bar") => value is never>,
    AssertExact<TypeGuard<never>, (value: number | string) => value is never>,
    AssertExact<NegatePredicate<TypeGuard<number, number | string>>, (value: number | string) => value is string>,
    AssertExact<NegatePredicate<(x: boolean, y: string) => boolean>, (x: boolean, y: string) => boolean>
];
