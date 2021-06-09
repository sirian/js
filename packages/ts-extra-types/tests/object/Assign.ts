import {AssertExact, Assign} from "../../src";

declare type Test = [
    AssertExact<{}, Assign<{}, []>>,
    AssertExact<{ x: 1 }, Assign<{ x: 1 }, []>>,
    AssertExact<{ x: 1, y: 2 }, Assign<{ x: 1 }, [{ y: 2 }]>>,
    AssertExact<{ x: 1, y: 2 } | { x: 1 }, Assign<{ x: 1 }, [{ y: 2 } | {}]>>,
    AssertExact<{ x: 2 }, Assign<{ x?: 1 | 2 }, [{ x: 2 }]>>,
    AssertExact<{ x: 1 }, Assign<{ x: number }, [{ x: 1 }]>>,
    AssertExact<{ x: 1, y: 3 }, Assign<{ x?: 1, y: 2 }, [{ x: 2 }, { x: number, y: 3 }, { x: 1 }]>>,
    AssertExact<{ x: 4, y: 2, z: 3 }, Assign<{ x: 1, z: 3 }, Array<{ x: 4, y: 2 }>>>,
    AssertExact<{ x: 1 } & object, Assign<{ x: 1 }, object[]>>,
];
