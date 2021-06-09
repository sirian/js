import {AssertExact, GetDeep} from "../../src";

declare type Test = [
    AssertExact<{}, GetDeep<{}, []>>,
    AssertExact<never, GetDeep<{}, ["x"]>>,
    AssertExact<1, GetDeep<{ x: 1 }, ["x"]>>,
    AssertExact<{ y: 1 }, GetDeep<{ x: { y: 1 } }, ["x"]>>,
    AssertExact<1, GetDeep<{ x: { y: 1 } }, ["x", "y"]>>,
    AssertExact<never, GetDeep<{ x: 1 }, ["x", "y"]>>,
    AssertExact<1 | undefined, GetDeep<{ x: { y?: 1 } }, ["x", "y"]>>,
    AssertExact<1 | undefined, GetDeep<{ x: { y?: 1 } }, ["x", "y"]>>,
    AssertExact<1 | undefined, GetDeep<{ x?: { y?: 1 } }, ["x", "y"]>>,
    AssertExact<1, GetDeep<{ x?: { y: 1 } }, ["x", "y"]>>,
];
