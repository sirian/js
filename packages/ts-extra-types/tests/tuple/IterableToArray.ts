import {AnyKey, AssertExact, IterableToArray} from "../../src";

declare type Test = [
    AssertExact<number[], IterableToArray<Iterable<number>>>,
    AssertExact<Array<number | string>, IterableToArray<Iterable<number | string>>>,
    AssertExact<Array<readonly [AnyKey, number]>, IterableToArray<Iterable<readonly [AnyKey, number]>>>,
];
