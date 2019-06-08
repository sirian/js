import {AssertExact, OverloadedReturn} from "../../src";

declare function f3(x: number): number;
declare function f3(x: string, y: boolean): object;
declare function f3(x?: object): string;

type Test = [
    AssertExact<number, OverloadedReturn<typeof f3, [number]>>,
    AssertExact<string, OverloadedReturn<typeof f3, []>>,
    AssertExact<never, OverloadedReturn<typeof f3, [string]>>,
    AssertExact<object, OverloadedReturn<typeof f3, [string, true]>>
];
