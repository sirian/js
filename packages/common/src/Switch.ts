import {Var} from "@sirian/common";
import {
    ArrayElementOf,
    Ctor,
    ExtractByTypeName,
    Func,
    Head,
    Predicate,
    Push,
    Tail,
    TypeGuard,
    TypeName,
} from "@sirian/ts-extra-types";

export type Case<T = any, F extends Func = any> = [T, F];

export type ExcludeCase<T, CL extends Case> = Exclude<T, CL[0]>;
export type ExcludeCases<T, CL extends Case[]> = Exclude<T, ArrayElementOf<CL>>;

export type CaseCallback<R, T, U, CL extends Case[]> = (value: ExcludeCases<T, CL> & U) => R;

export type DefaultCallback<T, R, CL extends Case[]> = CaseCallback<R, T, T, CL>;

export type CaseReturnType<C extends Case> = C extends Case<any, Func<infer R>> ? R : never;

export type CaseResult<T, C extends Case> =
    T extends C[0] ? CaseReturnType<C> : never;

export type CasesResult<T, CL extends Case[]> =
    {
        0: never;
        1: CaseResult<T, Head<CL>> | CasesResult<ExcludeCase<T, Head<CL>>, Tail<CL>>
    }[CL extends [] ? 0 : 1];

export type SwitchResult<T, CL extends any[]> =
    T extends any ? CasesResult<T, CL> : never;

export class Switch<T, CL extends any[] = []> {
    protected cases: CL;
    protected value: T;

    constructor(value: T) {
        this.value = value;
        this.cases = [] as any;
    }

    public static switch<T>(value: T) {
        return new Switch<T>(value);
    }

    public case<U, R>(cond: TypeGuard<U>, callback: CaseCallback<R, T, U, CL>): Switch<T, Push<CL, [U, R]>>;
    // public case<U, R>(cond: Predicate, callback: (value: R) => R): Switch<T, Push<CL, [U, R]>>;

    public case(cond: Predicate, callback: Func) {
        this.cases.push([cond, callback]);
        return this as any;
    }

    public eq<U, R>(value: U, callback: CaseCallback<R, T, U, CL>) {
        return this.case(Var.isEqual.bind(value) as TypeGuard<U>, callback);
    }

    public instanceOf<U, R>(ctor: Ctor<U>, callback: CaseCallback<R, T, U, CL>) {
        const fn = (x: any) => Var.isInstanceOf(x, ctor);
        return this.case(fn as TypeGuard<U>, callback);
    }

    public type<TN extends TypeName, R, U = ExtractByTypeName<T, TN>>(type: TN, callback: CaseCallback<R, T, U, CL>) {
        const fn = (x: any) => Var.isType(x, type);
        return this.case(fn as TypeGuard<U>, callback);
    }

    public resolve<R>(defaultCallback?: DefaultCallback<R, T, CL>): SwitchResult<T, Push<CL, [T, R]>> {
        const value = this.value;

        for (const [predicate, callback] of this.cases) {
            if (predicate(value)) {
                return callback(value);
            }
        }

        if (defaultCallback) {
            return defaultCallback(value as any) as any;
        }

        throw new Error(`Could not resolve "${value}" - no suitable cases found.`);
    }
}
