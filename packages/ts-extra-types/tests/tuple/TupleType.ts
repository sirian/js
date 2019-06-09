import {AssertExact, TupleType} from "../../src";

type Test = [
    AssertExact<"empty", TupleType<[]>>,
    AssertExact<"finite", TupleType<[1]>>,
    AssertExact<"finite", TupleType<[1?]>>,
    AssertExact<"finite", TupleType<[1, 1?]>>,
    AssertExact<"open", TupleType<[1, ...1[]]>>,
    AssertExact<"open", TupleType<[1, ...2[]]>>,
    AssertExact<"repeated", TupleType<[...2[]]>>,
    AssertExact<"repeated", TupleType<2[]>>
];
