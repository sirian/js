import {AssertExtends, AssertNotExtends, Predicate, TypeGuard} from "../../src";

type Test = [
    AssertExtends<() => true, Predicate<number>>,
    AssertExtends<TypeGuard<number>, Predicate<number>>,
    AssertExtends<(x: number) => boolean, Predicate<number>>,
    AssertExtends<(x: number, y?: string) => boolean, Predicate<number>>,

    AssertNotExtends<(x: number, y: any) => boolean, Predicate<number>>,
    AssertNotExtends<(x: number) => boolean, Predicate<string>>
];
