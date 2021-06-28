import {isEqual, isFunction, isPrimitive} from "@sirian/common";
import {Func, Func1, Primitive, TypeGuard} from "@sirian/ts-extra-types";
import {ArgResolveError} from "./ArgResolveError";

export type ArgConstraint<T = any> = TypeGuard<T>
    | (T extends Primitive ? T : never);

export type ArgGuardedType<C> =
    C extends Primitive ? C :
    C extends TypeGuard<infer U> ? U :
    never;

export type ArgExtractConstraint<T, C> = C extends ArgGuardedType<infer U> ? Extract<T & U, U> : never;
export type ArgClause = [ArgConstraint<any>, Func];

export class ArgResolver<T, R> {
    protected clauses: ArgClause[];
    protected value: T;

    constructor(value: T) {
        this.value = value;
        this.clauses = [] as any;
    }

    public static switch<T, R>(value: T) {
        return new ArgResolver<T, R>(value);
    }

    public static test<T>(value: any, constraint: ArgConstraint<T>): value is T {
        if (isPrimitive(constraint)) {
            return isEqual(value, constraint);
        }

        if (isFunction(constraint)) {
            return true === constraint(value);
        }

        throw new ArgResolveError(`Invalid constraint ${constraint}`);
    }

    public when<C>(constraint: C, callback: Func1<R, ArgExtractConstraint<T, C>>): this;
    public when(constraint: any, callback: any) {
        this.clauses.push([constraint, callback]);
        return this as any;
    }

    public resolve(defaultCallback?: (value: T) => R) {
        const value = this.value;

        for (const [constraint, callback] of this.clauses) {
            if (ArgResolver.test(value, constraint)) {
                return callback(value);
            }
        }

        if (defaultCallback) {
            return defaultCallback(value as any);
        }

        throw new ArgResolveError(`Could not resolve "${value}" - no suitable clauses found.`);
    }
}
