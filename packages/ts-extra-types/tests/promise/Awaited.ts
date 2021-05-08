import {AssertExact, Awaited} from "../../src";

type Test = [
    AssertExact<number, Awaited<PromiseLike<number>>>,
    AssertExact<number, Awaited<Promise<number>>>,
    AssertExact<number, Awaited<Promise<PromiseLike<number>>>>,
    AssertExact<number, Awaited<PromiseLike<Promise<number>>>>,
    AssertExact<number, Awaited<number>>,
    AssertExact<undefined, Awaited<Promise<void>>>,
];

export default Test;
