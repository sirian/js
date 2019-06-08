import {AssertExact, Xor} from "../../src";

type Test = [
    AssertExact<Xor<false, false>, false>,
    AssertExact<Xor<true, true>, false>,
    AssertExact<Xor<true, false>, true>,
    AssertExact<Xor<false, true>, true>,
    AssertExact<Xor<false, true>, true>
];
