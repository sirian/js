import {AssertExact, Require} from "../../src";

declare type Test = [
    AssertExact<{ x: number },
        Require<{ x: number }, "x">>,

    AssertExact<{ x: number },
        Require<{ x?: number }, "x">>,

    AssertExact<{ length: number | string },
        Require<{ length?: number | string }, "length">>,

    AssertExact<{ name: "test", x?: number, z: string },
        Require<{ name?: "test", x?: number, z: string }, "name">>,

    AssertExact<{ name: "test", x: number, z: string },
        Require<{ name?: "test", x?: number, z: string }>>,
];
