import {AssertExact, Overloads} from "../../src";

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
    AssertExact<Overloads<typeof f1>, [[number], number]>,
    AssertExact<Overloads<typeof f2>, [[number], number] | [[string, boolean], object]>,
    AssertExact<Overloads<typeof f3>, [[number], number] | [[string, boolean], object] | [[object?], string]>,
    AssertExact<Overloads<typeof f6>, [["1"], 1] | [["2"], 2] | [["3"], 3] | [["4"], 4] | [["5"], 5] | [["6"], 6]>
];
