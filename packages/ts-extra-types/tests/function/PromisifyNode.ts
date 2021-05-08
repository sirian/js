import {AssertExact, PromisifyNode} from "../../src";

type Callback<R> = (err: any, value: R) => any;

type Test = [
    AssertExact<never,
        PromisifyNode<() => void>>,

    AssertExact<() => Promise<2>,
        PromisifyNode<(c: Callback<2>) => void>>,

    AssertExact<(x: 1) => Promise<2>,
        PromisifyNode<(x: 1, c: Callback<2>) => void>>,

    AssertExact<(x: 1, y: 2) => Promise<2>,
        PromisifyNode<(x: 1, y: 2, c: Callback<2>) => void>>
];

export default Test;
