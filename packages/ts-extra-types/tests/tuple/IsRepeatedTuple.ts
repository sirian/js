import {IsRepeatedTuple, MustBeFalse, MustBeTrue} from "../../src";

declare type Test = [
    MustBeTrue<IsRepeatedTuple<1[]>>,
    MustBeTrue<IsRepeatedTuple<readonly 1[]>>,

    MustBeTrue<IsRepeatedTuple<Array<1 | undefined>>>,
    MustBeTrue<IsRepeatedTuple<readonly (1 | undefined)[]>>,

    MustBeTrue<IsRepeatedTuple<[...1[]]>>,
    MustBeTrue<IsRepeatedTuple<readonly [...1[]]>>,

    MustBeFalse<IsRepeatedTuple<[]>>,
    MustBeFalse<IsRepeatedTuple<readonly []>>,

    MustBeFalse<IsRepeatedTuple<[1?, ...1[]]>>,
    MustBeFalse<IsRepeatedTuple<readonly [1?, ...1[]]>>,

    MustBeFalse<IsRepeatedTuple<[1, ...1[]]>>,
    MustBeFalse<IsRepeatedTuple<readonly [1, ...1[]]>>,

    MustBeFalse<IsRepeatedTuple<[1]>>,
    MustBeFalse<IsRepeatedTuple<readonly [1]>>,

    MustBeFalse<IsRepeatedTuple<[1, ...1[]]>>,
    MustBeFalse<IsRepeatedTuple<readonly [1, ...1[]]>>,

    MustBeFalse<IsRepeatedTuple<[1?, ...1[]]>>,
    MustBeFalse<IsRepeatedTuple<readonly [1?, ...1[]]>>,

    MustBeFalse<IsRepeatedTuple<[2?, ...1[]]>>,
    MustBeFalse<IsRepeatedTuple<readonly [2?, ...1[]]>>,

];
