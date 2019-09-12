import {ArrayValueOf, AssertExact} from "../../src";

type Test = [
    AssertExact<never, ArrayValueOf<[]>>,
    AssertExact<string, ArrayValueOf<[string]>>,
    AssertExact<string | number, ArrayValueOf<[string, number]>>,
    AssertExact<string | number | boolean, ArrayValueOf<[string, number, boolean | number]>>,
    AssertExact<number, ArrayValueOf<number[]>>
];
