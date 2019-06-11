import {AssertExact, MustBeFalse, MustBeTrue, Some} from "../../src";

type Test = [
    MustBeFalse<Some<[]>>,
    MustBeFalse<Some<[false]>>,
    MustBeTrue<Some<[false, true]>>,
    MustBeFalse<Some<[false, false]>>,
    MustBeFalse<Some<false[]>>,
    MustBeTrue<Some<[true, ...false[]]>>,
    MustBeTrue<Some<[true]>>,
    MustBeTrue<Some<[true, true]>>,
    MustBeTrue<Some<true[]>>,
    MustBeTrue<Some<[true, ...true[]]>>,
    MustBeTrue<Some<[false, ...true[]]>>,
    MustBeTrue<Some<[true, ...boolean[]]>>,
    MustBeTrue<Some<[false, true, ...boolean[]]>>,
    AssertExact<boolean, Some<[false, ...boolean[]]>>,
    AssertExact<true, Some<[boolean, ...true[]]>>
];
