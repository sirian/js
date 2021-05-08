import {AssertExact, AssertExtends, AssertNotExtends, TupleOf} from "../../src";

type X = 1;

type Zero = TupleOf<true, 0>;
type One = TupleOf<true, 1>;
type Two = TupleOf<true, 2>;

type Test = [
    AssertExact<[string, string, string], TupleOf<string, 3>>,
    AssertExact<[] | [number, number] | [number, number, number, number], TupleOf<number, 0 | 2 | 4>>,
    AssertExact<number[], TupleOf<number, number>>,

    AssertExact<[], TupleOf<X, 0>>,
    AssertExact<[], TupleOf<never, 0>>,
    AssertExact<[X], TupleOf<X, 1>>,
    AssertExact<[X] | [X, X], TupleOf<X, 1 | 2>>,
    AssertExact<[] | [X] | [X, X], TupleOf<X, 0 | 1 | 2>>,
    AssertExact<[X, X], TupleOf<X, 2>>,
    AssertExact<[X, X, X], TupleOf<X, 3>>,
    AssertExact<[X, X, X, X, X, X], TupleOf<X, 6>>,
    AssertExact<X[], TupleOf<X, number>>,

    AssertExact<[], Zero>,
    AssertExtends<[], Zero>,
    AssertNotExtends<true[], Zero>,
    AssertNotExtends<[...true[]], Zero>,

    AssertExtends<[true], One>,
    AssertNotExtends<[], One>,
    AssertNotExtends<[false], One>,
    AssertNotExtends<[true, true], One>,
    AssertNotExtends<true[], One>,
    AssertNotExtends<[true, ...true[]], One>,

    AssertExtends<[true, true], Two>,
    AssertNotExtends<[], Two>,
    AssertNotExtends<[true], Two>,
    AssertNotExtends<[boolean, true], Two>,
    AssertNotExtends<true[], Two>,
    AssertNotExtends<[true, ...true[]], Two>,
    AssertNotExtends<[true, true, ...true[]], Two>
];

export default Test;
