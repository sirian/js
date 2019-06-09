import {And, AssertExact, MustBeFalse, MustBeTrue} from "../../src";

type Test = [
    MustBeTrue<And<true, true>>,
    MustBeFalse<And<true, false>>,

    MustBeFalse<And<false, true>>,
    MustBeFalse<And<false, false>>,

    MustBeFalse<And<false, boolean>>,
    MustBeFalse<And<boolean, false>>,

    AssertExact<boolean, And<boolean, true>>,
    AssertExact<boolean, And<true, boolean>>,
    AssertExact<boolean, And<boolean, boolean>>
];
