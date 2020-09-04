import {AssertExact, Rec} from "../../src";

type Test = [
    AssertExact<{1: 2}, Rec<1, 2>>,
    AssertExact<{1?: 1}, Rec<1 | undefined, 1>>,
];
