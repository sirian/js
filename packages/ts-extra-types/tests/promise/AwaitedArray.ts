import {AssertExact, AwaitedArray} from "../../src";

type Test = [
    AssertExact<[], AwaitedArray<[]>>,
    AssertExact<[1, 2, 3], AwaitedArray<[Promise<1>, 2, PromiseLike<Promise<3>>]>>,
    AssertExact<[1, 2 | null], AwaitedArray<[Promise<1>, 2 | null]>>,
    AssertExact<1[], AwaitedArray<Array<Promise<1>>>>,
    AssertExact<[2, ...1[]], AwaitedArray<[2, ...Array<Promise<1>>]>>,
];

export default Test;
