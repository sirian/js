import {
    Ctor,
    ExtractByTypeName,
    ExtractByXTypeName,
    ExtractFunction,
    ExtractObject,
    Primitive,
    TypeName,
    XTypeName,
    XTypeNameOf,
} from "@sirian/ts-extra-types";
import {Num} from "./Num";
import {Obj} from "./Obj";
import {Ref} from "./Ref";
import {Str} from "./Str";

export const Var = new class {
    public isNull(value: any): value is null {
        return null === value;
    }

    public isUndefined(value: any): value is undefined {
        return undefined === value;
    }

    public isNullable(value: any): value is null | undefined {
        return null === value || undefined === value;
    }

    public getXType<T>(value: T): XTypeNameOf<T>;
    public getXType(value: any) {
        if (null === value) {
            return "null";
        }
        if (Var.isArray(value)) {
            return "array";
        }

        return typeof value;
    }

    public isXType<V, T extends XTypeName>(value: V, ...types: T[] | [T[]]): value is ExtractByXTypeName<V, T>;
    public isXType(value: any, types: XTypeName | XTypeName[], ...rest: XTypeName[]) {
        const type = Var.getXType(value);

        if (types === type || -1 !== rest.indexOf(type)) {
            return true;
        }

        return Var.isArray(types) && -1 !== types.indexOf(type);
    }

    public isType<V, T extends TypeName>(value: V, ...types: T[] | [T[]]): value is ExtractByTypeName<V, T>;
    public isType(value: any, types: TypeName | TypeName[], ...rest: TypeName[]) {
        const type = typeof value;

        if (types === type || -1 !== rest.indexOf(type)) {
            return true;
        }

        return Var.isArray(types) && -1 !== types.indexOf(type);
    }

    public isNumber(value: any): value is number {
        return "number" === typeof value;
    }

    public isBigInt(value: any): value is bigint {
        return "bigint" === typeof value;
    }

    public isBoolean(value: any): value is boolean {
        return "boolean" === typeof value;
    }

    public isString(value: any): value is string {
        return "string" === typeof value;
    }

    public isPropertyKey(value: any): value is string | number | symbol {
        return Var.isType(value, "string", "number", "symbol");
    }

    public isPrimitive<T extends any>(value: T): value is Extract<T, Primitive> {
        return !Var.isObjectOrFunction(value);
    }

    public isSymbol(value: any): value is symbol {
        return "symbol" === typeof value;
    }

    public isFunction<T extends any>(value: T): value is ExtractFunction<T> {
        return "function" === typeof value;
    }

    public isConstructor(value: any) {
        if (!Var.isFunction(value)) {
            return false;
        }
        const o = {};
        const p = new Proxy(value, {
            construct: () => o,
        });

        try {
            return o === new p();
        } catch (e) {
            return false;
        }
    }

    public isTruthy(a: any) {
        return !!a;
    }

    public isFalsy(a: any) {
        return !a;
    }

    public isObject<T>(value: T): value is ExtractObject<T> {
        return null !== value && "object" === typeof value;
    }

    public isNumeric(value: any): value is string | number {
        return Var.isType(value, "number", "string") && !Var.isEqualNaN(value - parseFloat(value));
    }

    public isPromiseLike(value: any): value is PromiseLike<any> {
        return Var.isObjectOrFunction(value) && Ref.hasMethod(value, "then");
    }

    public isObjectOrFunction(value: any): value is object {
        return Var.isObject(value) || Var.isFunction(value);
    }

    public isInstanceOf<C extends Ctor>(obj: any, ctor: C): obj is InstanceType<C> {
        return obj instanceof ctor;
    }

    public isEqualNaN(value: any): value is number {
        return value !== value;
    }

    public isSubclassOf<A, B extends Ctor>(a: A, b: B): a is Extract<A, B> {
        if (!Var.isFunction(a) || !Var.isFunction(b)) {
            return false;
        }

        return Var.isInstanceOf(a.prototype, b) || Var.isEqual(a, b);
    }

    public isSameType<T>(x: any, value: T): value is T {
        if (x === null || value === null) {
            return x === value;
        }
        return typeof x === typeof value;
    }

    public isBetween<T extends string | number>(x: T, min: T, max: T) {
        if (!Var.isSameType(x, min) || !Var.isSameType(x, max)) {
            return false;
        }

        return x >= min && x <= max;
    }

    public isArray(value: any): value is any[] {
        return Array.isArray(value);
    }

    public isArrayLike(value: any): value is ArrayLike<any> {
        if (Var.isArray(value)) {
            return true;
        }

        if (!Var.isObject(value)) {
            return false;
        }

        if (!Ref.has(value, "length")) {
            return false;
        }

        const length = value.length;

        return Num.isInt(length) && length >= 0;
    }

    public isPlain(value: any) {
        return Var.isPlainArray(value) || Var.isPlainObject(value);
    }

    public isPlainArray(value: any): value is any[] {
        if (!Var.isArray(value)) {
            return false;
        }

        const proto = Ref.getPrototypeOf(value);

        if (!Var.isArray(proto)) {
            return false;
        }

        const nextProto = Ref.getPrototypeOf(proto);

        return !Var.isArray(nextProto);
    }

    public isRegExp(value: any): value is RegExp {
        return Var.isInstanceOf(value, RegExp);
    }

    public stringify(value: any) {
        if (Var.isNullable(value) || Var.isSymbol(value)) {
            return "";
        }

        return Str.stringify(value);
    }

    public isEqual(x: any, y: any) {
        if (x === y) {
            return true;
        }

        return Var.isEqualNaN(x) && Var.isEqualNaN(y);
    }

    public isPlainObject(x: any) {
        if (!Var.isObject(x)) {
            return false;
        }
        const prototype = Ref.getPrototypeOf(x);

        if (Obj.stringify(x) !== "[object Object]") {
            return !prototype;
        }

        if (!prototype) {
            return true;
        }

        if (prototype !== Object.prototype) {
            return false;
        }

        const ctor = x.constructor;

        return !ctor || !Var.isFunction(ctor) || ctor.prototype !== x;
    }
};
