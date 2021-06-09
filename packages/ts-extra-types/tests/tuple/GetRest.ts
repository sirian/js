import {AssertExact, GetRest} from "../../src";

declare type Test = [
    AssertExact<[], GetRest<[]>>,
    AssertExact<readonly [], GetRest<readonly []>>,

    AssertExact<1[], GetRest<1[]>>,
    AssertExact<readonly 1[], GetRest<readonly 1[]>>,

    AssertExact<2[], GetRest<[1, ...2[]]>>,
    AssertExact<readonly 2[], GetRest<readonly [1, ...2[]]>>,

    AssertExact<2[], GetRest<[1?, ...2[]]>>,
    AssertExact<readonly 2[], GetRest<readonly [1?, ...2[]]>>,

    AssertExact<2[], GetRest<[1, 2, ...2[]]>>,
    AssertExact<readonly 2[], GetRest<readonly [1, 2, ...2[]]>>,

    AssertExact<2[], GetRest<[1, 2?, ...2[]]>>,
    AssertExact<readonly 2[], GetRest<readonly [1, 2?, ...2[]]>>,

    AssertExact<3[], GetRest<[1?, 2?, ...3[]]>>,
    AssertExact<readonly 3[], GetRest<readonly [1?, 2?, ...3[]]>>,

];
