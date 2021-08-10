import {AssertExact, CastArray} from "@sirian/ts-extra-types";

declare type Test = [
    AssertExact<[], CastArray<[]>>,
    AssertExact<[null], CastArray<null>>,
    AssertExact<[null], CastArray<null, false>>,
    AssertExact<[], CastArray<null, true>>,
    AssertExact<[undefined], CastArray<undefined>>,
    AssertExact<[undefined], CastArray<undefined, false>>,
    AssertExact<[], CastArray<undefined, true>>,
    AssertExact<[1], CastArray<1>>,
    AssertExact<[1], CastArray<[1]>>,
    AssertExact<[1, 2], CastArray<[1, 2]>>,
    AssertExact<[1, 2, [3]], CastArray<[1, 2, [3]]>>,
    AssertExact<[Iterable<3>], CastArray<Iterable<3>>>,
]
