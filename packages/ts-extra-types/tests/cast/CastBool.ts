import {AssertExact, CastBool} from "../../src";

type Test = [
    AssertExact<true, CastBool<true>>,
    AssertExact<true, CastBool<1>>,
    AssertExact<true, CastBool<object>>,
    AssertExact<true, CastBool<symbol>>,

    AssertExact<boolean, CastBool<boolean>>,

    AssertExact<false, CastBool<false>>,
    AssertExact<false, CastBool<0>>,
    AssertExact<false, CastBool<"">>,
    AssertExact<false, CastBool<undefined>>,
    AssertExact<false, CastBool<void>>,
];
