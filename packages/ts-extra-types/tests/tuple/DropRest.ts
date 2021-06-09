import {AssertExact, DropRest} from "../../src";

declare type Test = [
    AssertExact<[], DropRest<[]>>,
    AssertExact<readonly [], DropRest<readonly []>>,

    AssertExact<[], DropRest<true[]>>,
    AssertExact<readonly [], DropRest<readonly true[]>>,

    AssertExact<[1], DropRest<[1, ...2[]]>>,
    AssertExact<readonly [1], DropRest<readonly [1, ...2[]]>>,

    AssertExact<[1, 2], DropRest<[1, 2, ...2[]]>>,
    AssertExact<readonly [1, 2], DropRest<readonly [1, 2, ...2[]]>>,

    AssertExact<[1, 2?], DropRest<[1, 2?, ...2[]]>>,
    AssertExact<readonly [1, 2?], DropRest<readonly [1, 2?, ...2[]]>>,

    AssertExact<[2?, 2?], DropRest<[2?, 2?, ...2[]]>>,
    AssertExact<readonly [2?, 2?], DropRest<readonly [2?, 2?, ...2[]]>>,

    AssertExact<[], DropRest<2[]>>,
    AssertExact<readonly [], DropRest<readonly 2[]>>,

];
