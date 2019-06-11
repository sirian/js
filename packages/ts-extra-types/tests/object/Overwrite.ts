import {AssertExact, Overwrite} from "../../src";

type Test = [
    AssertExact<{ x: 2 }, Overwrite<{ x: 1 }, { x: 2 }>>,
    AssertExact<{ x: 2 }, Overwrite<{ x?: 1 }, { x: 2 }>>,
    AssertExact<{ x?: 2 }, Overwrite<{ x?: 1 }, { x?: 2 }>>,
    AssertExact<{ x: 1, y: 2 }, Overwrite<{ x: 1 }, { y: 2 }>>,
    AssertExact<{ x: 1, y?: 2 }, Overwrite<{ x: 1 }, { y?: 2 }>>,
    AssertExact<{ x: 2, y?: 3 }, Overwrite<{ x: 1 }, { x: 2, y?: 3 }>>,
    AssertExact<{ x: 2, y?: 3 }, Overwrite<{ x: 1 }, { x: 2, y?: 3 }>>
];
