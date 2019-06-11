import {AssertExact, PromisifyNode} from "../../src";

type Callback<R> = (err: any, value: R) => any;

type Test = [
    AssertExact<() => Promise<boolean>,
        PromisifyNode<(c: Callback<boolean>) => void>>,

    AssertExact<(x: number) => Promise<boolean>,
        PromisifyNode<(x: number, c: Callback<boolean>) => void>>,

    AssertExact<(x: number, y: boolean) => Promise<boolean>,
        PromisifyNode<(x: number, y: boolean, c: Callback<boolean>) => void>>
];
