import {AssertExact, Awaited} from "../../src";

type Test = [
    AssertExact<number, Awaited<PromiseLike<number>>>,
    AssertExact<number, Awaited<Promise<number>>>,
    AssertExact<number, Awaited<number>>,
    AssertExact<number, Awaited<number>>
];
