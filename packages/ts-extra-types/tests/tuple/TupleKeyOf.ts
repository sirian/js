import {AssertExact, TupleKeyOf} from "../../src";

type Test = [
    AssertExact<never, TupleKeyOf<[]>>,

    AssertExact<"0", TupleKeyOf<[1]>>,
    AssertExact<"0", TupleKeyOf<[1, ...1[]]>>,
    AssertExact<"0", TupleKeyOf<[1?]>>,
    AssertExact<"0", TupleKeyOf<[1?, ...1[]]>>,

    AssertExact<"0" | "1", TupleKeyOf<[1, 2]>>,
    AssertExact<"0" | "1", TupleKeyOf<[1, 2, ...3[]]>>,

    AssertExact<"0" | "1", TupleKeyOf<[1, 2?]>>,
    AssertExact<"0" | "1", TupleKeyOf<[1, 2?, ...3[]]>>,

    AssertExact<"0" | "1", TupleKeyOf<[1?, 2?]>>,
    AssertExact<"0" | "1", TupleKeyOf<[1?, 2?, ...3[]]>>,

    AssertExact<never, TupleKeyOf<number[]>>
];

export default Test;
