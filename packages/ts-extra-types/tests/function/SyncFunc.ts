import {AnyFunc, AssertExtends, AssertNotExtends, Ctor, Func, Primitive, SyncFunc} from "../../src";

type Test = [
    AssertExtends<() => { then: number[] }, SyncFunc>,
    AssertExtends<() => { then: number }, SyncFunc>,
    AssertExtends<() => { then: { x: 1 } }, SyncFunc>,
    AssertExtends<() => { x: 1 }, SyncFunc>,
    AssertExtends<() => Primitive, SyncFunc>,
    AssertExtends<() => AnyFunc, SyncFunc>,
    AssertExtends<() => { then: Primitive }, SyncFunc>,
    AssertExtends<() => number[], SyncFunc>,
    AssertExtends<() => [1, 2], SyncFunc>,

    AssertNotExtends<() => Promise<any>, SyncFunc>,
    AssertNotExtends<() => PromiseLike<any>, SyncFunc>,
    AssertNotExtends<() => { then: Function }, SyncFunc>,
    AssertNotExtends<() => { then: FunctionConstructor }, SyncFunc>,
    AssertNotExtends<() => { then: Ctor }, SyncFunc>,
    AssertNotExtends<() => { then: Func }, SyncFunc>,
    AssertNotExtends<() => { then: AnyFunc }, SyncFunc>,
    AssertNotExtends<() => { then: number | (() => 1) }, SyncFunc>
];

export default Test;
