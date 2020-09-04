import {AssertExact, Length} from "../../src";

type Test = [
    AssertExact<0, Length<[]>>,
    AssertExact<1, Length<[1]>>,
    AssertExact<1 | 2, Length<[1, 2?]>>,
    AssertExact<0 | 1, Length<[1?]>>,

    AssertExact<0 | 1, Length<[] | [1]>>,
    AssertExact<never, Length<{}>>,
    AssertExact<3, Length<{length: 3}>>,
    AssertExact<number, Length<number[]>>,
];
