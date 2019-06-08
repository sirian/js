import {NumberToString} from "./cast";
import {MustBeArray} from "./mustbe";
import {Cons, DropLast, Head, LastElement, Length, Tail} from "./tuple";
import {NotFunc, Primitive, Thenable} from "./types";

export type Ctor<TInstance = any, TArgs extends any[] = any[]> = new(...args: TArgs) => TInstance;
export type Func<TReturn = any, TArgs extends any[] = any[], This = any> = (this: This, ...args: TArgs) => TReturn;
export type Func0<R = any> = () => R;
export type Func1<R = any, A = any> = (a: A) => R;
export type Func2<R = any, A = any, B = any> = (a: A, b: B) => R;
export type SyncFunc = (...args: any[]) => Primitive | object & { then?: NotFunc };
export type AsyncFunc = (...args: any[]) => Thenable;
export type Return<T> = T extends Func<infer R> ? R : never;
export type Instance<T> = T extends Ctor<infer R> ? R : never;
export type Normalizer<T, U> = (value: T) => U;

export type Args<F> =
    F extends Func<any, infer T> ? T :
    F extends Ctor<any, infer U> ? U :
    F extends Function ? any[] : never;

export type Arg<N extends number, F> =
    Args<F> extends MustBeArray<infer A>
    ? number extends N
      ? A[N]
      : NumberToString<N> extends keyof A
        ? A[N]
        : A[N] | undefined
    : never;

export type Arg1<F> = Arg<0, F>;
export type Arg2<F> = Arg<1, F>;
export type Arg3<F> = Arg<2, F>;
export type ArgLast<F> = LastElement<Args<F>>;

export type ArgCount<F> = Length<Args<F>>;

export type ThisArg<T> = ThisParameterType<T>;

export type PromisifyNode<F> =
    ArgLast<F> extends ((err: any, value: infer R) => any)
    ? Func<Promise<R>, DropLast<Args<F>>, ThisArg<F>>
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

export type OverloadedArgs<F extends Func> = Overloads<F>[0];
export type OverloadedReturn<F extends Func, TArgs extends any[]> =
    Overloads<F> extends infer O
    ? O extends [any[], any]
      ? TArgs extends O[0] ? O[1] : never
      : never
    : never;

export type Compose<T extends Func, U extends Func1<any, Return<T>>> = Func<Return<U>, Args<T>>;

export type ValidPipe<Fns extends Func[], Expected extends any[] = any[]> =
    {
        0: Head<Fns> extends Func<infer R>
           ? Cons<(...args: Expected) => any, ValidPipe<Tail<Fns>, [R]>>
           : never
        1: [];
    }[Fns extends [any, ...any[]] ? 0 : 1];

export type Pipe<Fns extends ValidPipe<Fns1>, Fns1 extends Func[] = Fns> =
    LastElement<Fns> extends Func<infer R>
    ? (...args: Args<Head<Fns>>) => R
    : never;
