import {AssertExact, AwaitedArray} from "../../src";

type Test = [
    AssertExact<[], AwaitedArray<[]>>,
    AssertExact<[1, 2, 3], AwaitedArray<[Promise<1>, 2, PromiseLike<Promise<3>>]>>,
];
