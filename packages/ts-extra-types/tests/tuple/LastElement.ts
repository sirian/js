import {AssertExact, LastElement} from "../../src";

declare type Test = [
    AssertExact<undefined, LastElement<[]>>,
    AssertExact<undefined, LastElement<readonly []>>,

    AssertExact<1, LastElement<[1]>>,
    AssertExact<1, LastElement<readonly [1]>>,

    AssertExact<3, LastElement<[1, 3]>>,
    AssertExact<3, LastElement<readonly [1, 3]>>,

    AssertExact<2, LastElement<[1, 3, 2]>>,
    AssertExact<2, LastElement<readonly [1, 3, 2]>>,

    AssertExact<3 | undefined, LastElement<3[]>>,
    AssertExact<3 | undefined, LastElement<readonly 3[]>>,

    AssertExact<1, LastElement<[1]>>,
    AssertExact<1, LastElement<readonly [1]>>,

    AssertExact<1 | undefined, LastElement<[1?]>>,
    AssertExact<1 | undefined, LastElement<readonly [1?]>>,

    AssertExact<undefined | 1 | 2, LastElement<[1?, 2?]>>,
    AssertExact<undefined | 1 | 2, LastElement<readonly [1?, 2?]>>,

    AssertExact<3, LastElement<[2, 3]>>,
    AssertExact<3, LastElement<readonly [2, 3]>>,

    // AssertExact<1 | undefined, LastElement<[2, ...1[]]>>,
    // AssertExact<1 | undefined, LastElement<readonly [2, ...1[]]>>,

    AssertExact<1 | 2 | undefined, LastElement<[1?, ...2[]]>>,
    AssertExact<1 | 2 | undefined, LastElement<readonly [1?, ...2[]]>>,

    AssertExact<1 | 2, LastElement<[1, ...2[]]>>,
    AssertExact<1 | 2, LastElement<readonly [1, ...2[]]>>,
];
