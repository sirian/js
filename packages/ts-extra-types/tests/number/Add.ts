import {Add, AssertExact} from "../../src";

type Test = [
    AssertExact<0, Add<0, 0>>,
    AssertExact<-1, Add<-1, 0>>,
    AssertExact<-1, Add<0, -1>>,
    AssertExact<1, Add<0, 1>>,
    AssertExact<1, Add<1, 0>>,
    AssertExact<6, Add<2, 4>>,
    AssertExact<6, Add<4, 2>>,
    AssertExact<100, Add<100, 0>>,
    AssertExact<100, Add<0, 100>>,
    AssertExact<number, Add<100, 100>>,
    AssertExact<number, Add<2, number>>,
    AssertExact<number, Add<number, 2>>,
    AssertExact<number, Add<number, number>>,
];

export default Test;
