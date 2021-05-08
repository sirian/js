import {AssertExact, IsExact, MustBeFalse, MustBeTrue} from "../../src";

type Test = [
    MustBeTrue<IsExact<1, 1>>,
    MustBeTrue<IsExact<[...number[]], number[]>>,
    MustBeTrue<IsExact<[...false[]], false[]>>,
    MustBeTrue<IsExact<(v: any) => v is true, (v: any) => v is true>>,
    MustBeFalse<IsExact<(v: any) => v is true, (v: unknown) => v is true>>,
    MustBeFalse<IsExact<[false?, ...false[]], false[]>>,
    MustBeFalse<IsExact<[false?, ...(false | undefined)[]], (false | undefined)[]>>,
    MustBeFalse<IsExact<[true, ...false[]], false[]>>,
    MustBeFalse<IsExact<{ x: 1 | undefined }, { x?: 1 }>>,
    MustBeFalse<IsExact<() => void, () => undefined>>,
    MustBeFalse<IsExact<{ x: 1 | null }, { x?: 1 }>>,

    MustBeTrue<IsExact<null, null>>,
    MustBeFalse<IsExact<null, undefined>>,
    MustBeFalse<IsExact<null, never>>,
    MustBeFalse<IsExact<null, void>>,
    MustBeFalse<IsExact<null, any>>,
    MustBeFalse<IsExact<null, unknown>>,

    MustBeFalse<IsExact<undefined, null>>,
    MustBeTrue<IsExact<undefined, undefined>>,
    MustBeFalse<IsExact<undefined, never>>,
    MustBeFalse<IsExact<undefined, void>>,
    MustBeFalse<IsExact<undefined, any>>,
    MustBeFalse<IsExact<undefined, unknown>>,

    MustBeFalse<IsExact<never, null>>,
    MustBeFalse<IsExact<never, undefined>>,
    MustBeTrue<IsExact<never, never>>,
    MustBeFalse<IsExact<never, void>>,
    MustBeFalse<IsExact<never, any>>,
    MustBeFalse<IsExact<never, unknown>>,

    MustBeFalse<IsExact<void, null>>,
    MustBeFalse<IsExact<void, undefined>>,
    MustBeFalse<IsExact<void, never>>,
    MustBeTrue<IsExact<void, void>>,
    MustBeFalse<IsExact<void, any>>,
    MustBeFalse<IsExact<void, unknown>>,

    MustBeFalse<IsExact<any, null>>,
    MustBeFalse<IsExact<any, undefined>>,
    MustBeFalse<IsExact<any, never>>,
    MustBeFalse<IsExact<any, void>>,
    MustBeTrue<IsExact<any, any>>,
    MustBeFalse<IsExact<any, unknown>>,

    MustBeFalse<IsExact<unknown, null>>,
    MustBeFalse<IsExact<unknown, undefined>>,
    MustBeFalse<IsExact<unknown, never>>,
    MustBeFalse<IsExact<unknown, void>>,
    MustBeFalse<IsExact<unknown, any>>,
    MustBeTrue<IsExact<unknown, unknown>>,

    MustBeFalse<IsExact<{}, object>>,
    MustBeFalse<IsExact<{ 1: 1 }, { "1": 1 }>>,

    MustBeFalse<IsExact<[1?, ...(1 | undefined)[]], Array<1 | undefined>>>,
    MustBeFalse<IsExact<[1?], [] | [1 | undefined]>>,
    MustBeFalse<IsExact<{x?: undefined}, {}>>,
    MustBeFalse<IsExact<[], readonly []>>,
    MustBeTrue<IsExact<(...args: []) => void, () => void>>,
    MustBeTrue<IsExact<[...1[]], 1[]>>,

    MustBeFalse<IsExact<{ x: null }, { x: undefined }>>,

    MustBeFalse<IsExact<{ x: 1 | null }, { x?: 1 | undefined }>>,
    MustBeFalse<IsExact<{ x: 1 | null }, { x: 1 | undefined }>>,
    MustBeFalse<IsExact<{ x?: 1 | null }, { x: 1 | null | undefined }>>,
    AssertExact<[number] | [string, boolean] | [object?], [number] | [string, boolean] | [x?: (object | undefined)]>,
];

export default Test;
