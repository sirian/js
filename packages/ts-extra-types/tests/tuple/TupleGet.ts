import {AssertExact, TupleGet} from "../../src";

type Foo = [0, 1, 2?, 3?, ...4[]];

type Test = [
    AssertExact<undefined, TupleGet<[], 0>>,
    AssertExact<1, TupleGet<[1], 0>>,
    AssertExact<undefined, TupleGet<[1], 1>>,
    AssertExact<1 | undefined, TupleGet<[1?], 0>>,
    AssertExact<1 | 2 | undefined, TupleGet<[1?, 2?], number>>,
    AssertExact<1 | 2 | undefined, TupleGet<[1, 2?], number>>,
    AssertExact<0, TupleGet<Foo, 0>>,
    AssertExact<1, TupleGet<Foo, 1>>,
    AssertExact<2 | undefined, TupleGet<Foo, 2>>,
    AssertExact<3 | undefined, TupleGet<Foo, 3>>,
    AssertExact<3 | undefined, TupleGet<Foo, 3>>,
    AssertExact<4 | undefined, TupleGet<Foo, 4>>,
    AssertExact<4 | undefined, TupleGet<Foo, 5>>,
    AssertExact<undefined | 0 | 1 | 2 | 3 | 4, TupleGet<Foo, number>>,
    AssertExact<number | undefined, TupleGet<number[], 0>>,
    AssertExact<number | undefined, TupleGet<number[], 1>>,
];
