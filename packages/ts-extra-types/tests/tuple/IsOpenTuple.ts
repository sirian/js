import {IsOpenTuple, MustBeFalse, MustBeTrue} from "../../src";

declare type Test = [
    MustBeTrue<IsOpenTuple<[true, ...boolean[]]>>,
    MustBeTrue<IsOpenTuple<readonly [true, ...boolean[]]>>,

    MustBeTrue<IsOpenTuple<[true, ...true[]]>>,
    MustBeTrue<IsOpenTuple<readonly [true, ...true[]]>>,

    MustBeTrue<IsOpenTuple<[true?, ...true[]]>>,
    MustBeTrue<IsOpenTuple<readonly [true?, ...true[]]>>,

    MustBeTrue<IsOpenTuple<true[]>>,
    MustBeTrue<IsOpenTuple<readonly true[]>>,

    MustBeFalse<IsOpenTuple<[]>>,
    MustBeFalse<IsOpenTuple<readonly []>>,

    MustBeFalse<IsOpenTuple<[true]>>,
    MustBeFalse<IsOpenTuple<readonly [true]>>,

    MustBeFalse<IsOpenTuple<[true?]>>,
    MustBeFalse<IsOpenTuple<readonly [true?]>>,
];
