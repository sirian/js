import {AssertExact, Replace} from "../../src";

declare type Test = [
    AssertExact<{ x: 2 }, Replace<{ x: 1 }, { x: 2 }>>,
    AssertExact<{ x: 2 }, Replace<{ x?: 1 }, { x: 2 }>>,
    AssertExact<{ x?: 2 }, Replace<{ x?: 1 }, { x?: 2 }>>,
    AssertExact<{ x: 1 }, Replace<{ x: 1 }, { y: 2 }>>,
    AssertExact<{ x: 1, y?: 2, z: 3 }, Replace<{ x: 1, y: 4, z: 3 }, { y?: 2 }>>,
    AssertExact<{ x: 1 }, Replace<{ x: 1 }, { y?: 2 }>>
];
