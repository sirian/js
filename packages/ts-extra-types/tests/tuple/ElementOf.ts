import {ArrayElementOf, AssertExact} from "../../src";

type Test = [
    AssertExact<never, ArrayElementOf<[]>>,
    AssertExact<string, ArrayElementOf<[string]>>,
    AssertExact<string | number, ArrayElementOf<[string, number]>>,
    AssertExact<string | number | boolean, ArrayElementOf<[string, number, boolean | number]>>,
    AssertExact<number, ArrayElementOf<number[]>>
];
