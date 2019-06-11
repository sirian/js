import {AssertExact, MustBeArray, Rewrite} from "../../src";

type TypeGuard1 = <T>(x: T) => x is Rewrite<T>;
type TypeGuard2 = <T>(x: T | Rewrite<T>) => x is T;

function foo<T>(t: T, tg1: TypeGuard1, tg2: TypeGuard2): [Rewrite<T>, TypeGuard1, TypeGuard2] {
    return [t, tg2, tg1];
}

type Test = [
    AssertExact<{ x: 1 }, Rewrite<{ x: 1 }>>,
    AssertExact<{ x?: 1 }, Rewrite<{ x?: 1 }>>,
    AssertExact<[1, 2], Rewrite<[1, 2]>>,
    AssertExact<{ readonly x: 1 }, Rewrite<{ x: 1 }>>,
    AssertExact<{ x: 1, y: 1 }, Rewrite<{ x: 1, y: 1 }>>,
    AssertExact<number, Rewrite<number>>,
    AssertExact<never, Rewrite<never>>,
    AssertExact<[number?], Rewrite<[number?]>>,
    AssertExact<[number?, boolean?], Rewrite<[number?, boolean?]>>,
    AssertExact<number | string, Rewrite<number | string>>,
    AssertExact<TypeGuard1, TypeGuard2>,
    AssertExact<TypeGuard2, TypeGuard1>,
    MustBeArray<Rewrite<[1, 2]>>,
    MustBeArray<Rewrite<number[]>>
];
