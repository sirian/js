import {AssertExact, Assign} from "../../src";

type Test = [
    AssertExact<{}, Assign<{}, []>>,
    AssertExact<{ x: 1 }, Assign<{ x: 1 }, []>>,
    AssertExact<{ x: 1, y: 2 }, Assign<{ x: 1 }, [{ y: 2 }]>>,
    AssertExact<{ x: 2 }, Assign<{ x?: 1 | 2 }, [{ x: 2 }]>>
];
