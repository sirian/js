import {AssertExact, Case, Switch} from "../../src";

type FalseCase<T> = Case<false, T>;
type TrueCase<T> = Case<true, T>;

type Test = [
    AssertExact<never, Switch<[]>>,

    AssertExact<never, Switch<[
        FalseCase<number>
    ]>>,

    AssertExact<number, Switch<[
        TrueCase<number>
    ]>>,

    AssertExact<2, Switch<[
        FalseCase<1>,
        TrueCase<2>
    ]>>,

    AssertExact<2, Switch<[
        FalseCase<1>,
        TrueCase<2>,
        TrueCase<3>
    ]>>,

    AssertExact<1, Switch<[
        TrueCase<1>,
        FalseCase<2>,
        TrueCase<3>
    ]>>,

    AssertExact<4, Switch<[
        FalseCase<1>,
        FalseCase<2>,
        FalseCase<3>,
        TrueCase<4>,
        FalseCase<5>
    ]>>
];
