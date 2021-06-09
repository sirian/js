import {AssertExact, Take} from "../../src";

declare type Test = [
    AssertExact<[], Take<0, []>>,
    AssertExact<readonly [], Take<0, readonly []>>,

    AssertExact<[], Take<0, [number, string, boolean]>>,
    AssertExact<readonly [], Take<0, readonly [number, string, boolean]>>,

    AssertExact<[number], Take<1, [number, string, boolean]>>,
    AssertExact<readonly [number], Take<1, readonly [number, string, boolean]>>,

    AssertExact<[number, string], Take<2, [number, string, boolean]>>,
    AssertExact<readonly [number, string], Take<2, readonly [number, string, boolean]>>,

    AssertExact<[number, string, boolean], Take<3, [number, string, boolean]>>,
    AssertExact<readonly [number, string, boolean], Take<3, readonly [number, string, boolean]>>,

    AssertExact<[number, string, boolean], Take<4, [number, string, boolean]>>,
    AssertExact<readonly [number, string, boolean], Take<4, readonly [number, string, boolean]>>,

    AssertExact<[], Take<0, [1, 2?, 3?]>>,
    AssertExact<readonly [], Take<0, readonly [1, 2?, 3?]>>,

    AssertExact<[1], Take<1, [1, 2?, 3?]>>,
    AssertExact<readonly [1], Take<1, readonly [1, 2?, 3?]>>,

    AssertExact<[1, 2?], Take<2, [1, 2?, 3?]>>,
    AssertExact<readonly [1, 2?], Take<2, readonly [1, 2?, 3?]>>,

    AssertExact<[1, 2?, 3?], Take<3, [1, 2?, 3?]>>,
    AssertExact<readonly [1, 2?, 3?], Take<3, readonly [1, 2?, 3?]>>,

    AssertExact<[], Take<0, number[]>>,
    AssertExact<readonly [], Take<0, readonly number[]>>,

    AssertExact<[boolean], Take<1, [boolean, ...number[]]>>,
    AssertExact<readonly [boolean], Take<1, readonly [boolean, ...number[]]>>,

    AssertExact<[boolean, number?], Take<2, [boolean, ...number[]]>>,
    AssertExact<readonly [boolean, number?], Take<2, readonly [boolean, ...number[]]>>,

    AssertExact<[number?], Take<1, number[]>>,
    AssertExact<readonly [number?], Take<1, readonly number[]>>,

    AssertExact<[number?, number?], Take<2, number[]>>,
    AssertExact<readonly [number?, number?], Take<2, readonly number[]>>,

];
