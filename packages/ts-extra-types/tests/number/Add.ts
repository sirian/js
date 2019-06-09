import {Add, AssertExact} from "../../src";

type Test = [
    AssertExact<0, Add<0, 0>>,
    AssertExact<1, Add<0, 1>>,
    AssertExact<1, Add<1, 0>>,
    AssertExact<6, Add<2, 4>>,
    AssertExact<number, Add<100, 100>>,
    AssertExact<number, Add<2, number>>,
    AssertExact<number, Add<number, number>>,
    AssertExact<number, Add<number, 2>>
];
