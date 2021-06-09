import {IsFiniteTuple, MustBeFalse, MustBeTrue} from "../../src";

declare type Test = [
    MustBeTrue<IsFiniteTuple<[]>>,
    MustBeTrue<IsFiniteTuple<readonly []>>,

    MustBeTrue<IsFiniteTuple<[number]>>,
    MustBeTrue<IsFiniteTuple<readonly [number]>>,

    MustBeTrue<IsFiniteTuple<[number?]>>,
    MustBeTrue<IsFiniteTuple<readonly [number?]>>,

    MustBeTrue<IsFiniteTuple<[number, string]>>,
    MustBeTrue<IsFiniteTuple<readonly [number, string]>>,

    MustBeFalse<IsFiniteTuple<[number, ...number[]]>>,
    MustBeFalse<IsFiniteTuple<readonly [number, ...number[]]>>,

    MustBeFalse<IsFiniteTuple<[number?, ...number[]]>>,
    MustBeFalse<IsFiniteTuple<readonly [number?, ...number[]]>>,

    MustBeFalse<IsFiniteTuple<number[]>>,
    MustBeFalse<IsFiniteTuple<readonly number[]>>,

];
