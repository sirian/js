import {AssertExact, Partialize} from "../../src";

declare type Test = [
    AssertExact<{}, Partialize<{}>>,
    AssertExact<{ x?: number }, Partialize<{ x: number }, "x">>,
    AssertExact<{ x: number }, Partialize<{ x: number }, never>>,
    AssertExact<{ x?: number, y: string }, Partialize<{ x: number, y: string }, "x">>,
    AssertExact<{ x?: number, y?: string }, Partialize<{ x: number, y: string }, "x" | "y">>,
    AssertExact<{ x?: number, y?: string }, Partialize<{ x: number, y: string }>>,
    AssertExact<{ x: number, y: string }, Partialize<{ x: number, y: string }, never>>
];
