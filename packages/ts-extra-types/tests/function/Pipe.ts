import {AssertExact, Pipe} from "../../src";

type Test = [
    AssertExact<() => 1, Pipe<[() => 1]>>,
    AssertExact<() => 2, Pipe<[() => 1, (x: 1) => 2]>>,
    AssertExact<(x: 1, y: 2) => 4, Pipe<[(x: 1, y: 2) => 3, (x: 3) => 4]>>,
    AssertExact<(x: 1, y: 2) => 5, Pipe<[(x: 1, y: 2) => 3, (x: 3) => 4, (x: 4) => 5]>>
];
