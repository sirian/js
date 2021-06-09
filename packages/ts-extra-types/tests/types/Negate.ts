import {AssertExact, Negate, TypeGuard} from "../../src";

type X = number | "foo" | "bar";

declare type Test = [
    AssertExact<Negate<TypeGuard<"foo", X>>, (value: number | "foo" | "bar") => value is "bar" | number>,
    AssertExact<Negate<TypeGuard<number, X>>, (value: number | "foo" | "bar") => value is "foo" | "bar">,
    AssertExact<Negate<TypeGuard<X, X>>, (value: number | "foo" | "bar") => value is never>,
    AssertExact<Negate<TypeGuard<number, number | string>>, (value: number | string) => value is string>,

    AssertExact<Negate<(x: boolean, y: string) => boolean>, (x: boolean, y: string) => boolean>,
    AssertExact<Negate<(x: boolean, y: string) => true>, (x: boolean, y: string) => false>,
    AssertExact<Negate<(x: boolean, y: string) => false>, (x: boolean, y: string) => true>,

    AssertExact<Negate<() => void | undefined | null | false>, () => true>,
    AssertExact<Negate<() => string>, () => boolean>,
    AssertExact<Negate<() => number>, () => boolean>,
    AssertExact<Negate<() => boolean>, () => boolean>,
    AssertExact<Negate<() => false>, () => true>,
    AssertExact<Negate<() => true>, () => false>,
    AssertExact<Negate<() => 0 | 1>, () => boolean>,
    AssertExact<Negate<() => 0>, () => true>,
    AssertExact<Negate<() => "">, () => true>,
    AssertExact<Negate<() => never>, () => never>,
];
