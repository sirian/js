import {AssertExact, ObjKeyOf} from "../../src";

type Test = [
    AssertExact<"1", ObjKeyOf<{ 1: 1 }>>,
    AssertExact<"1", ObjKeyOf<{ "1": 1 }>>,
    AssertExact<"0", ObjKeyOf<[1]>>,
    AssertExact<"0" | `${number}`, ObjKeyOf<[1, ...2[]]>>,
    AssertExact<`${number}`, ObjKeyOf<1[]>>,
    AssertExact<"0" | "2" | "length", ObjKeyOf<{ 0: 1, "2": 2, length: 3 }>>
];
