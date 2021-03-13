import {AssertExact, OverloadedReturn} from "../../src";

type F1 = () => number;

type F2 = F1 & { (x: string, y: boolean): object };

type F3 = {
    (x: number): number;
    (x: string, y: boolean): object;
    (x?: object): string;
};

type F6 = {
    (x: "1"): 1;
    (x: "2"): 2;
    (x: "3"): 3;
    (x: "4"): 4;
    (x: "5"): 5;
    (x: "6"): 6;
};

type Test = [
    AssertExact<number, OverloadedReturn<F3, [number]>>,
    AssertExact<string, OverloadedReturn<F3, [{}]>>,
    AssertExact<string, OverloadedReturn<F3, []>>,
    AssertExact<never, OverloadedReturn<F3, [string]>>,
    AssertExact<object, OverloadedReturn<F3, [string, true]>>
];
