import {Args, AssertExact, OverloadedArgs} from "../../src";

declare function f1(x: number): number;

declare function f2(x: number): number;
declare function f2(x: string, y: boolean): object;

declare function f3(x: number): number;
declare function f3(x: string, y: boolean): object;
declare function f3(x?: object): string;

declare function f6(x: "1"): 1;
declare function f6(x: "2"): 2;
declare function f6(x: "3"): 3;
declare function f6(x: "4"): 4;
declare function f6(x: "5"): 5;
declare function f6(x: "6"): 6;

type Test = [
    AssertExact<Args<typeof f1>, [number]>,
    AssertExact<OverloadedArgs<typeof f1>, [number]>,

    AssertExact<Args<typeof f2>, [string, boolean]>,
    AssertExact<OverloadedArgs<typeof f2>, [number] | [string, boolean]>,

    AssertExact<Args<typeof f3>, [object?]>,
    AssertExact<OverloadedArgs<typeof f3>, [number] | [string, boolean] | [object?]>,

    AssertExact<Args<typeof f6>, ["6"]>,
    AssertExact<OverloadedArgs<typeof f6>, ["1"] | ["2"] | ["3"] | ["4"] | ["5"] | ["6"]>
];
