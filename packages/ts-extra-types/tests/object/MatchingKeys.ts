import {AssertExact, MatchingKeys} from "../../src";

type Test = [
    AssertExact<never, MatchingKeys<{ x: number }, {}>>,
    AssertExact<string, MatchingKeys<Record<string, boolean>, { [id: string]: boolean }>>,
    AssertExact<number, MatchingKeys<Record<number, boolean>, { [id: number]: boolean }>>,
    AssertExact<"x", MatchingKeys<{ x: number }, { x: number, y: string }>>,
    AssertExact<never, MatchingKeys<{ x: number }, { x?: number, y: string }>>,
    AssertExact<never, MatchingKeys<{ x: number }, { x?: number, y: string }>>,
    AssertExact<never, MatchingKeys<{ x: number }, { x?: number, y: string }>>,
    AssertExact<{ x: number }, { x?: number } & { x: string | number }>,
    AssertExact<never, MatchingKeys<{ x?: number }, { x: number | undefined }>>,
    AssertExact<"x", MatchingKeys<{ x?: number }, { x?: number | undefined }>>
];
