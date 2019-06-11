import {AssertExact, AssertExtends, AssertNotExtends, Repeat} from "../../src";

type T = true;

type Zero = Repeat<0, true>;
type One = Repeat<1, true>;
type Two = Repeat<2, true>;

type Test = [
    AssertExact<[], Repeat<0, T>>,
    AssertExact<[], Repeat<0, never>>,
    AssertExact<[T], Repeat<1, T>>,
    AssertExact<[T, T?], Repeat<1 | 2, T>>,
    AssertExact<[T?, T?], Repeat<0 | 1 | 2, T>>,
    AssertExact<[T, T], Repeat<2, T>>,
    AssertExact<[T, T, T], Repeat<3, T>>,
    AssertExact<[T, T, T, T, T, T], Repeat<6, T>>,
    AssertExact<T[], Repeat<number, T>>,

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
