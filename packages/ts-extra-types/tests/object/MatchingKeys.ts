import {AssertExact, MatchingKeys} from "../../src";

type Test = [
    AssertExact<never, MatchingKeys<{ x: 1 }, {}>>,
    AssertExact<never, MatchingKeys<{ x: 1 }, { readonly x: 1 }>>,
    AssertExact<never, MatchingKeys<{ readonly x: 1 }, {x: 1}>>,
    AssertExact<never, MatchingKeys<{ "0": 1 }, { 0: 1 }>>,
    AssertExact<"x", MatchingKeys<{ x: 1 }, {x: 1}>>,
    AssertExact<string, MatchingKeys<Record<string, 2>, { [id: string]: 2 }>>,
    AssertExact<number, MatchingKeys<Record<number, 2>, { [id: number]: 2 }>>,
    AssertExact<"x", MatchingKeys<{ x: 1 }, { x: 1, y: 3 }>>,
    AssertExact<never, MatchingKeys<{ x: 1 }, { x?: 1, y: 3 }>>,
    AssertExact<never, MatchingKeys<{ x: 1 }, { x?: 1, y: 3 }>>,
    AssertExact<never, MatchingKeys<{ x: 1 }, { x?: 1, y: 3 }>>,
    AssertExact<{ x: 1 }, { x?: 1 } & { x: 3 | 1 }>,
    AssertExact<never, MatchingKeys<{ x?: 1 }, { x: 1 | undefined }>>,
    AssertExact<"x", MatchingKeys<{ x?: 1 }, { x?: 1 | undefined }>>
];
