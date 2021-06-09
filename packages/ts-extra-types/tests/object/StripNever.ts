import {AssertExact, OmitNever} from "../../src";

declare type Test = [
    AssertExact<{}, OmitNever<{}>>,
    AssertExact<{}, OmitNever<{ x: never }>>,
    AssertExact<{ y: number }, OmitNever<{ x: never, y: number }>>,
    AssertExact<{ y?: number }, OmitNever<{ x: never, y?: number | never }>>,
    AssertExact<{}, OmitNever<{ x: true & false }>>
];
