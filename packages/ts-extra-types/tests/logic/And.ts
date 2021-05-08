import {And, AssertExact, AssertFalse, AssertTrue} from "../../src";

type Test = [
    AssertTrue<And<true, true>>,
    AssertFalse<And<true, false>>,

    AssertFalse<And<false, true>>,
    AssertFalse<And<false, false>>,

    AssertFalse<And<false, boolean>>,
    AssertFalse<And<boolean, false>>,

    AssertExact<boolean, And<boolean, true>>,
    AssertExact<boolean, And<true, boolean>>,
    AssertExact<boolean, And<boolean, boolean>>
];
