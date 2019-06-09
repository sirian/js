import {AssertExact, LastIndex} from "../../src";

type Test = [
    AssertExact<unknown, LastIndex<[]>>,
    AssertExact<0, LastIndex<[number]>>,
    AssertExact<1, LastIndex<[number, boolean]>>,
    AssertExact<2, LastIndex<[number, boolean, string]>>,
    AssertExact<number, LastIndex<boolean[]>>,
    AssertExact<0, LastIndex<[1]>>,
    AssertExact<0, LastIndex<[1?]>>,
    AssertExact<1, LastIndex<[1, 2?]>>
];
