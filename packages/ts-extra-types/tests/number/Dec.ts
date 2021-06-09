import {AssertExact, Dec} from "../../src";

declare type Test = [
    AssertExact<-1, Dec<0>>,
    AssertExact<0, Dec<1>>,
    AssertExact<1, Dec<2>>,
    AssertExact<2, Dec<3>>,
    AssertExact<3, Dec<4>>,
    AssertExact<4, Dec<5>>,
    AssertExact<5, Dec<6>>,
    AssertExact<6, Dec<7>>,
    AssertExact<7, Dec<8>>,
    AssertExact<8, Dec<9>>,
    AssertExact<number, Dec<100>>,
    AssertExact<number, Dec<number>>
];
