import {AssertExact, DropRest} from "../../src";

type Test = [
    AssertExact<[], DropRest<[]>>,
    AssertExact<[], DropRest<true[]>>,
    AssertExact<[1], DropRest<[1, ...2[]]>>,
    AssertExact<[1, 2], DropRest<[1, 2, ...2[]]>>,
    AssertExact<[1, 2?], DropRest<[1, 2?, ...2[]]>>,
    AssertExact<[2?, 2?], DropRest<[2?, 2?, ...2[]]>>,
    AssertExact<[], DropRest<2[]>>
];
