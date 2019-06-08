import {AssertExact, Unshift} from "../../src";

type Test = [
    AssertExact<[number], Unshift<[], number>>,

    AssertExact<[boolean, string], Unshift<[string], boolean>>,

    AssertExact<[number, ...string[]], Unshift<string[], number>>,

    AssertExact<[number, ...number[]], Unshift<number[], number>>
];
