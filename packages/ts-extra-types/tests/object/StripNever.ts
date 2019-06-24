import {AssertExact, OmitNever} from "../../src";

type Test = [
    AssertExact<{}, OmitNever<{}>>,
    AssertExact<{}, OmitNever<{ x: never }>>,
    AssertExact<{ y: number }, OmitNever<{ x: never, y: number }>>,
    AssertExact<{ y?: number }, OmitNever<{ x: never, y?: number | never }>>,
    AssertExact<{ x: true & false }, OmitNever<{ x: true } & { x: false }>>
];
