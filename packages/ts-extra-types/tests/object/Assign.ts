import {AssertExact, Assign} from "../../src";

type Test = [
    AssertExact<{}, Assign<{}, []>>,
    AssertExact<{ x: 1 }, Assign<{ x: 1 }, []>>,
    AssertExact<{ x: 1, y: 2 }, Assign<{ x: 1 }, [{ y: 2 }]>>,
    AssertExact<{ x: 2 }, Assign<{ x?: 1 | 2 }, [{ x: 2 }]>>,
    AssertExact<{ x: string }, Assign<{ x: number }, [{ x: string }]>>,
    AssertExact<{ x: string, y: 3 }, Assign<{ x?: 1, y: 2 }, [{ x: 2 }, {x: number, y: 3}, {x: string}]>>
];
