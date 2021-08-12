import {AssertExact, Awaited, MaybePromise} from "../../src";

declare type Test = [
    AssertExact<number, Awaited<PromiseLike<number>>>,
    AssertExact<number, Awaited<Promise<number>>>,
    AssertExact<number, Awaited<Promise<PromiseLike<number>>>>,
    AssertExact<number, Awaited<PromiseLike<Promise<number>>>>,
    AssertExact<number, Awaited<MaybePromise<number>>>,
    AssertExact<number, Awaited<number>>,
    AssertExact<undefined, Awaited<Promise<void>>>,
];
