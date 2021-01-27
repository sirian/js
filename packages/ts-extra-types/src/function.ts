import {Thenable} from "./interfaces";
import {MustBeArray, MustBeFunc} from "./mustbe";
import {Overwrite} from "./object";
import {Awaited} from "./promise";
import {ArrayRO, Head, LastElement, Length, Tuple, TupleGet} from "./tuple";
import {NotFunc, Primitive} from "./types";

export type Ctor<T = any, A extends ArrayRO = any[]> = new(...args: A) => T;
export type Ctor0<T = any> = Ctor<T, []>;
export type Ctor1<T = any, A = any> = Ctor<T, [A]>;
export type Ctor2<T = any, A = any, B = any> = Ctor<T, [A, B]>;

export type WithMethod<M extends PropertyKey, R = any, A extends ArrayRO = any[]> = { [P in M]: Func<R, A> };

export type Creatable<T = any, A extends ArrayRO = any[]> = WithMethod<"create", T, A>;

export type Newable<T = any> = Overwrite<NewableFunction, { prototype: T }>;

export type Instance<T> =
    T extends Ctor<infer R> ? R :
    T extends Newable<infer P> ? P :
    never;

export type Func<TReturn = any, TArgs extends ArrayRO = any[], This = any> = (this: This, ...args: TArgs) => TReturn;
export type Func0<R = any> = () => R;
export type Func1<R = any, A = any> = (a: A) => R;
export type Func2<R = any, A = any, B = any> = (a: A, b: B) => R;

export type Return<T> = T extends Func<infer R> ? R : never;

export type UpdateReturn<R1, R2> =
    R1 extends PromiseLike<infer U>
    ? PromiseLike<Awaited<U | R2>>
    : R1 | R2;

export type SyncFunc = Func<Primitive | object & { then?: NotFunc }>;
export type AsyncFunc = Func<Thenable>;

export type Args<F> =
    F extends Func<any, infer A> ? A :
    F extends Ctor<any, infer U> ? U :
    F extends Function ? unknown[] :
    never;

export type CtorArgs<F> = F extends Ctor<any, infer A> ? A : never;
export type FnArgs<F> = F extends Func<any, infer A> ? A : never;

export type Arg<N extends number, F> =
    Args<F> extends MustBeArray<infer A> ? TupleGet<A, N> : never;

export type Arg1<F> = Arg<0, F>;
export type Arg2<F> = Arg<1, F>;
export type Arg3<F> = Arg<2, F>;
export type ArgLast<F> = LastElement<Args<F>>;

export type ArgCount<F> = Length<Args<F>>;

export type ThisArg<T> = ThisParameterType<T>;

export type PromisifyNode<F> =
    Args<F> extends MustBeArray<infer A>
    ? A extends [...infer U, infer Last]
      ? Last extends (err: any, value: infer R) => any
        ? Func<Promise<R>, U, ThisArg<F>>
        : never
      : never
    : never;

export type Overloads<F extends Func> =
    F extends {
          (...args: infer A1): infer R1; (...args: infer A2): infer R2; (...args: infer A3): infer R3;
          (...args: infer A4): infer R4; (...args: infer A5): infer R5; (...args: infer A6): infer R6;
      } ? [A1, R1] | [A2, R2] | [A3, R3] | [A4, R4] | [A5, R5] | [A6, R6] :
    F extends {
          (...args: infer A1): infer R1; (...args: infer A2): infer R2; (...args: infer A3): infer R3;
          (...args: infer A4): infer R4; (...args: infer A5): infer R5;
      } ? [A1, R1] | [A2, R2] | [A3, R3] | [A4, R4] | [A5, R5] :
    F extends {
          (...args: infer A1): infer R1; (...args: infer A2): infer R2;
          (...args: infer A3): infer R3; (...args: infer A4): infer R4;
      } ? [A1, R1] | [A2, R2] | [A3, R3] | [A4, R4] :
    F extends {
          (...args: infer A1): infer R1; (...args: infer A2): infer R2; (...args: infer A3): infer R3;
      } ? [A1, R1] | [A2, R2] | [A3, R3] :
    F extends {
          (...args: infer A1): infer R1; (...args: infer A2): infer R2;
      } ? [A1, R1] | [A2, R2] :
    F extends {
          (...args: infer A1): infer R1;
      } ? [A1, R1] :
    never;

export type OverloadedArgs<F extends Func> =
    Overloads<F>[0];

export type OverloadedReturn<F extends Func, TArgs extends ArrayRO> =
    Overloads<F> extends infer O
    ? O extends [infer A, infer R]
      ? TArgs extends A ? R : never
      : never
    : never;

export type Compose<T extends Func, U extends Func1<any, Return<T>>> = Func<Return<U>, Args<T>>;

export type ValidPipe<Fns extends Func[], Expected extends ArrayRO = any[]> =
    Fns extends Tuple<MustBeFunc<infer H>, infer Z>
    ? H extends Func<infer R>
      ? Z extends Func[]
        ? [Func<any, Expected>, ...ValidPipe<Z, [R]>]
        : never
      : never
    : [];

export type Pipe<Fns extends ValidPipe<Fns1>, Fns1 extends Func[] = Fns> =
    LastElement<Fns> extends Func<infer R>
    ? Func<R, Args<Head<Fns>>>
    : never;
