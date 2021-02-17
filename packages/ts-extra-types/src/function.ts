import {NotThenable, Thenable} from "./interfaces";
import {Overwrite} from "./object";
import {ArrayRO, LastElement, Length, TupleGet} from "./tuple";

export type Ctor<T = any, A extends ArrayRO = any[]> = new(...args: A) => T;
export type Ctor0<T = any> = Ctor<T, []>;
export type Ctor1<T = any, A = any> = Ctor<T, [A]>;
export type Ctor2<T = any, A = any, B = any> = Ctor<T, [A, B]>;

export type Newable<T = any> = Overwrite<NewableFunction, { prototype: T }>;

export type Instance<T> =
    T extends Ctor<infer R> ? R :
    T extends { prototype: infer P } ? P :
    never;

export type Func<TReturn = any, TArgs extends ArrayRO = any[], This = any> = (this: This, ...args: TArgs) => TReturn;
export type Func0<R = any> = () => R;
export type Func1<R = any, A = any> = (a: A) => R;
export type Func2<R = any, A = any, B = any> = (a: A, b: B) => R;
// export type VoidFunc<TArgs extends ArrayRO = any[], This = any> = (this: This, ...args: TArgs) => void;

export type Return<T> = T extends Func<infer R> ? R : never;

// export type UpdateReturn<R1, R2> =
//     R1 extends PromiseLike<any>
//     ? PromiseLike<Awaited<R1 | R2>>
//     : R1 | R2;

export type SyncFunc = Func<NotThenable>;
export type AsyncFunc = Func<Thenable>;

export type Args<F> =
    F extends Func<any, infer A> ? A :
    F extends Ctor<any, infer U> ? U :
    F extends Function ? unknown[] :
    never;

export type CtorArgs<F> = F extends Ctor<any, infer A> ? A : never;
export type FnArgs<F> = F extends Func<any, infer A> ? A : never;

export type Arg<N extends number, F> = TupleGet<Args<F>, N>;

export type Arg1<F> = Arg<0, F>;
export type Arg2<F> = Arg<1, F>;
export type Arg3<F> = Arg<2, F>;
export type ArgLast<F> = LastElement<Args<F>>;

export type ArgCount<F> = Length<Args<F>>;

export type ThisArg<T> = ThisParameterType<T>;

export type PromisifyNode<F> =
    Args<F> extends [...infer A, (err: any, value: infer R) => any]
    ? Func<Promise<R>, A, ThisArg<F>>
    : never;

export type Overloads<F extends Func> =
    F extends {
          (...a: infer A1): infer R1; (...a: infer A2): infer R2; (...a: infer A3): infer R3;
          (...a: infer A4): infer R4; (...a: infer A5): infer R5; (...a: infer A6): infer R6;
      } ? [A1, R1] | [A2, R2] | [A3, R3] | [A4, R4] | [A5, R5] | [A6, R6] :
    F extends {
          (...a: infer A1): infer R1; (...a: infer A2): infer R2; (...a: infer A3): infer R3;
          (...a: infer A4): infer R4; (...a: infer A5): infer R5;
      } ? [A1, R1] | [A2, R2] | [A3, R3] | [A4, R4] | [A5, R5] :
    F extends {
          (...a: infer A1): infer R1; (...a: infer A2): infer R2;
          (...a: infer A3): infer R3; (...a: infer A4): infer R4;
      } ? [A1, R1] | [A2, R2] | [A3, R3] | [A4, R4] :
    F extends {
          (...a: infer A1): infer R1; (...a: infer A2): infer R2; (...a: infer A3): infer R3;
      } ? [A1, R1] | [A2, R2] | [A3, R3] :
    F extends {
          (...a: infer A1): infer R1; (...a: infer A2): infer R2;
      } ? [A1, R1] | [A2, R2] :
    F extends {
          (...a: infer A1): infer R1;
      } ? [A1, R1] :
    never;

export type OverloadedArgs<F extends Func> = Overloads<F>[0];

export type OverloadedReturn<F extends Func, TArgs extends ArrayRO> =
    Overloads<F> extends infer O
    ? O extends [infer A, infer R]
      ? TArgs extends A ? R : never
      : never
    : never;

export type Compose<T extends Func, U extends (v: Return<T>) => any> = (...args: Args<T>) => Return<U>;

// type ValidPipe<Fns extends Func[], Expected extends ArrayRO = any[]> =
//     Fns extends [Func<infer R>, ...infer Z]
//     ? [Func<any, Expected>, ...ValidPipe<Cast<Z, Func[]>, [R]>]
//     : [];
//
// export type Pipe<Fns extends ValidPipe<Fns1>, Fns1 extends Func[] = Fns> =
//     Func<Return<LastElement<Fns>>, Args<Head<Fns>>>;
