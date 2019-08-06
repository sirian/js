import {
    AnyFunc,
    Ctor,
    ExtractByTypeName,
    ExtractByXTypeName,
    Instance,
    Lengthwise,
    Newable,
    Primitive,
    Thenable,
    TypeName,
    XTypeName,
    XTypeNameOf,
} from "@sirian/ts-extra-types";
import {Num} from "./Num";
import {Obj} from "./Obj";
import {Ref} from "./Ref";
import {Str} from "./Str";

export class Var {
    public static isNull(value: any): value is null {
        return null === value;
    }

    public static isUndefined(value: any): value is undefined {
        return undefined === value;
    }

    public static isNullable(value: any): value is null | undefined {
        return null === value || undefined === value;
    }

    public static getXType<T>(value: T): XTypeNameOf<T>;
    public static getXType(value: any) {
        if (null === value) {
            return "null";
        }
        if (Var.isArray(value)) {
            return "array";
        }

        return typeof value;
    }

    public static isXType<V, T extends XTypeName>(v: V, types: T | T[]): v is ExtractByXTypeName<V, T> {
        const type: any = Var.getXType(v);

        return Var.isArray(types) ? Var.isSome(type, types) : type === types;
    }

    public static isType<V, T extends TypeName>(v: V, types: T | T[]): v is ExtractByTypeName<V, T> {
        const type = typeof v;
        return Var.isArray(types) ? Var.isSome(type, types) : type === types;
    }

    public static isSome<U>(value: any, values: U[]): value is U {
        return values.includes(value);
    }

    public static isNumber(value: any): value is number {
        return "number" === typeof value;
    }

    public static isBigInt(value: any): value is bigint {
        return "bigint" === typeof value;
    }

    public static isBoolean(value: any): value is boolean {
        return "boolean" === typeof value;
    }

    public static isString(value: any): value is string {
        return "string" === typeof value;
    }

    public static isPropertyKey(value: any): value is PropertyKey {
        return Var.isType(value, ["string", "number", "symbol"]);
    }

    public static isPrimitive(value: any): value is Primitive {
        return !Var.isObjectOrFunction(value);
    }

    public static isSymbol(value: any): value is symbol {
        return "symbol" === typeof value;
    }

    public static isFunction<T extends any>(value: T): value is Extract<T, AnyFunc> {
        return "function" === typeof value;
    }

    public static isConstructor<T>(value: T): value is Extract<T, Newable> {
        if (!Var.isFunction(value)) {
            return false;
        }
        const p: any = new Proxy(value, {construct: () => ({})});

        try {
            return new p() && true;
        } catch (e) {
            return false;
        }
    }

    public static isTruthy(a: any) {
        return !!a;
    }

    public static isFalsy(a: any) {
        return !a;
    }

    public static isObject<T>(value: T): value is Exclude<Extract<T, object>, AnyFunc> {
        return null !== value && "object" === typeof value;
    }

    public static isNumeric(value: any): value is string | number {
        return Var.isType(value, ["number", "string"]) && !Var.isEqualNaN(value - parseFloat(value));
    }

    public static isPromiseLike(value: any): value is Thenable {
        return Var.isObjectOrFunction(value) && Ref.hasMethod(value, "then");
    }

    public static isObjectOrFunction(value: any): value is object {
        return Var.isObject(value) || Var.isFunction(value);
    }

    public static isInstanceOf<C extends Ctor | Newable>(obj: any, ctor: C): obj is Instance<C> {
        return Var.isFunction(ctor) && (obj instanceof ctor);
    }

    public static isEqualNaN(value: any): value is number {
        return value !== value;
    }

    public static isSubclassOf<A, B extends Ctor | NewableFunction>(a: A, b: B): a is Extract<A, B> {
        if (!Var.isFunction(a) || !Var.isFunction(b)) {
            return false;
        }

        return Var.isInstanceOf(a.prototype, b) || Var.isEqual(a, b);
    }

    public static isSameType<T>(x: any, value: T): value is T {
        if (x === null || value === null) {
            return x === value;
        }
        return typeof x === typeof value;
    }

    public static isBetween<T extends string | number | bigint>(x: T, min: T, max: T) {
        if (!Var.isSameType(x, min) || !Var.isSameType(x, max)) {
            return false;
        }

        return x >= min && x <= max;
    }

    public static isArray(value: any): value is unknown[] {
        return Array.isArray(value);
    }

    public static isArrayLike<T>(value: T): value is Lengthwise & Extract<T, Lengthwise> {
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

    public static isPlain(value: any) {
        return Var.isPlainArray(value) || Var.isPlainObject(value);
    }

    public static isPlainArray(value: any): value is unknown[] {
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

    public static isRegExp(value: any): value is RegExp {
        return Var.isInstanceOf(value, RegExp);
    }

    public static stringify(value: any) {
        if (Var.isNullable(value) || Var.isSymbol(value)) {
            return "";
        }

        return Str.stringify(value);
    }

    public static isEqual(x: any, y: any) {
        if (x === y) {
            return true;
        }

        return Var.isEqualNaN(x) && Var.isEqualNaN(y);
    }

    public static isPlainObject(x: any) {
        if (!Var.isObject(x)) {
            return false;
        }
        const prototype = Ref.getPrototypeOf(x);

        if (Obj.getStringTag(x) !== "Object") {
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
}
