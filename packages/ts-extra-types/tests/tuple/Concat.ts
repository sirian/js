import {AssertExact, Concat} from "../../src";

type Test = [
    AssertExact<[], Concat<[], []>>,
    AssertExact<[number], Concat<[], [number]>>,
    AssertExact<[number], Concat<[number], []>>,
    AssertExact<[true, false], Concat<[true], [false]>>,
    AssertExact<[1, 2, 3, 4, 5], Concat<[1, 2, 3], [4, 5]>>,
    AssertExact<[string, number], Concat<[string], [number]>>,
    AssertExact<[string, boolean, number, object], Concat<[string, boolean], [number, object]>>
];
