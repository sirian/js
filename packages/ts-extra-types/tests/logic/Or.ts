import {AssertExact, MustBeFalse, MustBeTrue, Or} from "../../src";

type Test = [
    MustBeTrue<Or<true, true>>,
    MustBeTrue<Or<true, false>>,

    MustBeTrue<Or<false, true>>,
    MustBeFalse<Or<false, false>>,

    MustBeTrue<Or<boolean, true>>,
    MustBeTrue<Or<true, boolean>>,

    AssertExact<boolean, Or<boolean, false>>,
    AssertExact<boolean, Or<false, boolean>>,
    AssertExact<boolean, Or<boolean, boolean>>
];
