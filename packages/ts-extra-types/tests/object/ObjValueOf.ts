import {AssertExact, ObjValueOf} from "../../src";

declare type Test = [
    AssertExact<never, ObjValueOf<{}>>,
    AssertExact<1, ObjValueOf<{x: 1}>>,
    AssertExact<1 | 2, ObjValueOf<{x: 1, y: 2}>>,
    AssertExact<never, ObjValueOf<[]>>,
    AssertExact<1 | 2, ObjValueOf<[1, 2]>>,
    AssertExact<1 | 2 | 3, ObjValueOf<[1, 2, ...3[]]>>,
    AssertExact<number, ObjValueOf<number[]>>,
];
