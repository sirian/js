import {AssertExact, GetRest} from "../../src";

type Test = [
    AssertExact<[], GetRest<[]>>,
    AssertExact<1[], GetRest<1[]>>,
    AssertExact<2[], GetRest<[1, ...2[]]>>,
    AssertExact<2[], GetRest<[1?, ...2[]]>>,
    AssertExact<2[], GetRest<[1, 2, ...2[]]>>,
    AssertExact<2[], GetRest<[1, 2?, ...2[]]>>,
    AssertExact<3[], GetRest<[1?, 2?, ...3[]]>>,
];

export default Test;
