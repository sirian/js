import {AssertExact, Inc} from "../../src";

type Test = [
    AssertExact<number, Inc<-1>>,
    AssertExact<1, Inc<0>>,
    AssertExact<2, Inc<1>>,
    AssertExact<3, Inc<2>>,
    AssertExact<4, Inc<3>>,
    AssertExact<5, Inc<4>>,
    AssertExact<6, Inc<5>>,
    AssertExact<7, Inc<6>>,
    AssertExact<8, Inc<7>>,
    AssertExact<9, Inc<8>>,
    AssertExact<10, Inc<9>>,
    AssertExact<11, Inc<10>>,
    AssertExact<number, Inc<100>>,
    AssertExact<number, Inc<number>>
];

export default Test;
