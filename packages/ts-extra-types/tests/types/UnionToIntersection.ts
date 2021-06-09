import {AssertExact, UnionToIntersection} from "../../src";

declare type Test = [
    AssertExact<string & number,
        UnionToIntersection<number | string>>,

    AssertExact<{ x: number },
        UnionToIntersection<{ x: number }>>,

    AssertExact<{ x: 3 },
        UnionToIntersection<{ x: number } | { x: 3 }>>,

    AssertExact<{ x: string & number },
        UnionToIntersection<{ x: number } | { x: string }>>,

    AssertExact<{ x: string } & { x: number },
        UnionToIntersection<{ x: number } | { x: string }>>,

    AssertExact<{ x: string, z: boolean } & { y: number },
        UnionToIntersection<{ x: string, z: boolean } | { y: number }>>
];
