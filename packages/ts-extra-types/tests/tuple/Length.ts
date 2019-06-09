import {AssertExact, Length} from "../../src";

type Test = [
    AssertExact<[]["length"], Length<[]>>,
    AssertExact<0, Length<[]>>,

    AssertExact<[1]["length"], Length<[1]>>,
    AssertExact<1, Length<[1]>>,

    AssertExact<[1?]["length"], Length<[1?]>>,
    AssertExact<0 | 1, Length<[1?]>>,

    AssertExact<0 | 1, Length<[] | [1]>>,
    AssertExact<0 | 1, ([] | [1])["length"]>
];
