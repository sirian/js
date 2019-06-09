import {AssertExact, Take} from "../../src";

type Test = [
    AssertExact<[], Take<0, []>>,

    AssertExact<[], Take<0, [number, string, boolean]>>,
    AssertExact<[number], Take<1, [number, string, boolean]>>,
    AssertExact<[number, string], Take<2, [number, string, boolean]>>,
    AssertExact<[number, string, boolean], Take<3, [number, string, boolean]>>,
    AssertExact<[number, string, boolean], Take<4, [number, string, boolean]>>,

    AssertExact<[], Take<0, [1, 2?, 3?]>>,
    AssertExact<[1], Take<1, [1, 2?, 3?]>>,
    AssertExact<[1, 2 | undefined], Take<2, [1, 2?, 3?]>>,
    AssertExact<[1, 2 | undefined, 3 | undefined], Take<3, [1, 2?, 3?]>>,

    AssertExact<[], Take<0, number[]>>,
    AssertExact<[boolean], Take<1, [boolean, ...number[]]>>,
    AssertExact<[boolean, number], Take<2, [boolean, ...number[]]>>,
    AssertExact<[number], Take<1, number[]>>,
    AssertExact<[number, number], Take<2, number[]>>
];
