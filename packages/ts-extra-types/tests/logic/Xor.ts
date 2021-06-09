import {AssertExact, Xor} from "../../src";

declare type Test = [
    AssertExact<Xor<false, false>, false>,
    AssertExact<Xor<true, true>, false>,
    AssertExact<Xor<true, false>, true>,
    AssertExact<Xor<false, true>, true>,
    AssertExact<Xor<false, true>, true>
];
