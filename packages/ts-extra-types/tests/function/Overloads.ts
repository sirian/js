import {AssertExact, Overloads} from "../../src";

type F1 = () => number;

type F2 = F1 & { (x: string, y: boolean): object };

type F3 = {
    (x: 1): 1;
    (x: 2, y: 3): 4;
    (x?: 5): 6;
};

type F6 = {
    (x: "1"): 1;
    (x: "2"): 2;
    (x: "3"): 3;
    (x: "4"): 4;
    (x: "5"): 5;
    (x: "6"): 6;
};

declare type Test = [
    AssertExact<Overloads<(...args: any[]) => any>, [any[], any]>,
    AssertExact<Overloads<(...args: unknown[]) => any>, [unknown[], any]>,
    AssertExact<Overloads<(...args: never[]) => never>, [never[], never]>,
    AssertExact<Overloads<F1>, [[], number]>,
    AssertExact<Overloads<F2>, [[], number] | [[string, boolean], object]>,
    AssertExact<Overloads<F3>, [[1], 1] | [[2, 3], 4] | [[5?], 6]>,
    AssertExact<Overloads<F6>, [["1"], 1] | [["2"], 2] | [["3"], 3] | [["4"], 4] | [["5"], 5] | [["6"], 6]>
];
