import {AssertExtends, AssertNotExtends, EmptyTuple} from "../../src";

type Test = [
    AssertExtends<[], EmptyTuple>,
    AssertExtends<EmptyTuple, []>,
    AssertNotExtends<number[], []>,
    AssertNotExtends<[1?], []>,
    AssertNotExtends<[1?, ...number[]], []>,
    AssertNotExtends<unknown[], []>,
];
