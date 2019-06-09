import {AssertExact, Every, MustBeFalse, MustBeTrue} from "../../src";

type Test = [
    MustBeTrue<Every<[]>>,
    MustBeFalse<Every<[false]>>,
    MustBeFalse<Every<[false, true]>>,
    MustBeFalse<Every<[false, false]>>,
    MustBeFalse<Every<false[]>>,
    MustBeFalse<Every<[true, ...false[]]>>,
    MustBeTrue<Every<[true]>>,
    MustBeTrue<Every<[true, true]>>,
    MustBeTrue<Every<true[]>>,
    MustBeTrue<Every<[true, ...true[]]>>,
    AssertExact<boolean, Every<[true, ...boolean[]]>>,
    AssertExact<boolean, Every<[boolean]>>,
    AssertExact<false, Every<[boolean, ...false[]]>>
];
