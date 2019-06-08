import {AssertExtends, AssertNotExtends, Ctor, Func, NotFunc, Primitive, SyncFunc} from "../../src";

type Test = [
    AssertExtends<{ x: 1 }, NotFunc>,
    AssertExtends<Primitive, NotFunc>,
    AssertExtends<any[], NotFunc>,
    AssertNotExtends<Ctor, NotFunc>,
    AssertNotExtends<SyncFunc, NotFunc>,
    AssertNotExtends<Func, NotFunc>,
    AssertNotExtends<FunctionConstructor, NotFunc>
];
