import {AssertExact, InversePredicate, TypeGuard} from "../../src";

type X = number | "foo" | "bar";

type Test = [
    AssertExact<InversePredicate<TypeGuard<"foo", X>>, (value: number | "foo" | "bar") => value is "bar" | number>,
    AssertExact<InversePredicate<TypeGuard<number, X>>, (value: number | "foo" | "bar") => value is "foo" | "bar">,
    AssertExact<InversePredicate<TypeGuard<X, X>>, (value: number | "foo" | "bar") => value is never>,
    AssertExact<TypeGuard<never>, (value: number | string) => value is never>,
    AssertExact<InversePredicate<TypeGuard<number, number | string>>, (value: number | string) => value is string>,
    AssertExact<InversePredicate<(x: boolean, y: string) => boolean>, (x: boolean, y: string) => boolean>
];
