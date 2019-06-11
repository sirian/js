import {AssertExact, Get} from "../../src";

export type Test = [
    AssertExact<0, Get<[], "length">>,
    AssertExact<undefined, Get<[], 0>>,
    AssertExact<never, Get<[], "0">>,
    AssertExact<undefined, Get<[], 1>>,
    AssertExact<never, Get<[], "1">>,

    AssertExact<1, Get<[0], "length">>,
    AssertExact<0, Get<[0], 0>>,
    AssertExact<undefined, Get<[0], 1>>,
    AssertExact<0, Get<[0], "0">>,
    AssertExact<never, Get<[0], "1">>,

    AssertExact<0 | 1, Get<[0?], "length">>,
    AssertExact<0 | undefined, Get<[0?], 0>>,
    AssertExact<undefined, Get<[0?], 1>>,
    AssertExact<0 | undefined, Get<[0?], "0">>,
    AssertExact<never, Get<[0?], "1">>,

    AssertExact<number, Get<[0, 1?, ...2[]], "length">>,
    AssertExact<0, Get<[0, 1?, ...2[]], 0>>,
    AssertExact<0, Get<[0, 1?, ...2[]], "0">>,
    AssertExact<1 | undefined, Get<[0, 1?, ...2[]], 1>>,
    AssertExact<1 | undefined, Get<[0, 1?, ...2[]], "1">>,

    AssertExact<number, Get<[0, ...1[]], "length">>,
    AssertExact<0, Get<[0, ...1[]], 0>>,
    AssertExact<0, Get<[0, ...1[]], "0">>,
    AssertExact<1, Get<[0, ...1[]], 1>>,
    AssertExact<never, Get<[0, ...1[]], "1">>,

    AssertExact<number, Get<0[], "length">>,
    AssertExact<0, Get<0[], 0>>,
    AssertExact<never, Get<0[], "0">>,
    AssertExact<0, Get<0[], 1>>,
    AssertExact<never, Get<0[], "1">>,

    AssertExact<0, Get<{ 0: 0 }, 0>>,
    AssertExact<never, Get<{ 0: 0 }, 1>>,

    AssertExact<0, Get<{ 0: 0 }, "0">>,
    AssertExact<never, Get<{ 0: 0 }, "1">>,

    AssertExact<0, Get<{ "0": 0 }, 0>>,
    AssertExact<never, Get<{ "0": 0 }, 1>>,

    AssertExact<0, Get<{ "0": 0 }, "0">>,
    AssertExact<never, Get<{ "0": 0 }, "1">>
];
