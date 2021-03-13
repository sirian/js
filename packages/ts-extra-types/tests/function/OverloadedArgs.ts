import {Args, AssertExact, OverloadedArgs, Overloads} from "../../src";

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
type Z = Overloads<F3>;
type Test = [
    AssertExact<Args<F1>, []>,
    AssertExact<OverloadedArgs<F1>, []>,

    AssertExact<Args<F2>, [string, boolean]>,
    AssertExact<OverloadedArgs<F2>, [] | [string, boolean]>,

    AssertExact<Args<F3>, [object?]>,
    AssertExact<OverloadedArgs<F3>, [number] | [string, boolean] | [object?]>,

    AssertExact<Args<F6>, ["6"]>,
    AssertExact<OverloadedArgs<F6>, ["1"] | ["2"] | ["3"] | ["4"] | ["5"] | ["6"]>
];
