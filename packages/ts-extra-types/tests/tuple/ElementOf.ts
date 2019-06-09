import {AssertExact, ElementOf} from "../../src";

type Test = [
    AssertExact<never, ElementOf<[]>>,
    AssertExact<string, ElementOf<[string]>>,
    AssertExact<string | number, ElementOf<[string, number]>>,
    AssertExact<string | number | boolean, ElementOf<[string, number, boolean | number]>>,
    AssertExact<number, ElementOf<number[]>>
];
