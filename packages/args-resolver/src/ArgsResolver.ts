import {isArray, isFunction} from "@sirian/common";
import {Expand, Func} from "@sirian/ts-extra-types";
import {ArgResolveError} from "./ArgResolveError";
import {ArgConstraint, ArgResolver} from "./ArgResolver";

export type ArgsClause = [any, any];

export type StripLengthwise<T> = T extends any ? Omit<Expand<T>, Exclude<keyof any[], "length">> : never;

export type ArgsConstraint<U> = {
    [P in keyof U]: ArgConstraint<U[P]>
};

export type ExtractTuple<T extends any[], U> = any[]; // todo
// ObjectToArray<StripLengthwise<T> & StripLengthwise<U>> extends infer O
// ? [O] extends [T]
//   ? O
//   : never
// : never;

export type ExtractTuples<T extends any[], U> =
    T extends any
    ? ExtractTuple<T, U>
    : never;
export type ArgsCallback<R, T extends any[], U> = (...args: ExtractTuples<T, U>) => R;

export class ArgsResolver<T extends any[], R> {
    protected clauses: ArgsClause[];
    protected value: T;

    constructor(value: T) {
        this.value = value;
        this.clauses = [] as any;
    }

    public static test(value: any, constraint: any) {
        if (isArray(constraint)) {
            for (const [key, c] of constraint.entries()) {
                if (!ArgResolver.test(value[key], c)) {
                    return false;
                }
            }
            return true;
        }

        if (isFunction(constraint)) {
            return constraint(value);
        }

        throw new ArgResolveError(`Invalid constraint ${constraint}`);
    }

    public static switch<T extends any[], R>(value: T) {
        return new ArgsResolver<T, R>(value);
    }

    public when<U extends object>(constraint: ArgsConstraint<U>, callback: ArgsCallback<R, T, U>): this;
    public when(constraint: any, callback: Func) {
        this.clauses.push([constraint, callback]);
        return this as any;
    }

    public resolve(defaultCallback?: Func<R, T>) {
        const value = this.value;

        for (const [constraint, callback] of this.clauses) {
            if (ArgsResolver.test(value, constraint)) {
                return callback(...value);
            }
        }

        if (defaultCallback) {
            return defaultCallback(...value as any) as any;
        }

        throw new ArgResolveError(`Could not resolve "${value}" - no suitable clauses found.`);
    }
}
