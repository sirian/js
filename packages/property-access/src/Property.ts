import {Ref, Str, Var} from "@sirian/common";
import {Get, GetDeep, Tail} from "@sirian/ts-extra-types";
import {PropertyAccessError, UnexpectedTypeError} from "./Error";
import {Path, PathElement, PathKey, PropertyPath} from "./PropertyPath";

export type DeepType<T, P extends Path> =
    P extends PropertyKey ? Get<T, P, unknown> :
    P extends any[]
    ? {
        0: T
        1: GetDeep<Get<T, P[0]>, Tail<P>>;
    }[P extends [any, ...any[]] ? 1 : 0]
    : never;

export const enum AccessType {
    NOT_FOUND,
    PROPERTY,
    METHOD,
}

export interface AccessInfo {
    type: AccessType;
    key: PathKey;
}

export class Property {
    public static readonly instance = new Property();

    public static read<T, P extends Path>(target: T, path: P) {
        return Property.instance.read(target, path);
    }

    public static write<T, P extends Path>(target: T, path: P, value: DeepType<T, P>) {
        return Property.instance.write(target, path, value);
    }

    public static modify<T, P extends Path>(target: T, path: P, fn: (value?: DeepType<T, P>) => DeepType<T, P>) {
        Property.instance.modify(target, path, fn);
    }

    public static isReadable(target: object, path: Path) {
        return Property.instance.isReadable(target, path);
    }

    public static isWritable(target: object, path: Path) {
        return Property.instance.isWritable(target, path);
    }

    public modify<T, P extends Path>(target: T, path: P, fn: (value?: DeepType<T, P>) => DeepType<T, P>) {
        const value = this.isReadable(target, path) ? this.read(target, path) : undefined;
        return this.write(target, path, fn(value));
    }

    public read<T, P extends Path>(target: T, path: P): DeepType<T, P> {
        const pPath = PropertyPath.from(path);

        const props = this.readPropertiesUntil(target, pPath, pPath.length);

        return props.pop();
    }

    public write<T, P extends Path>(target: T, path: P, value: DeepType<T, P>) {
        const pPath = PropertyPath.from(path);

        let prop: any = target;

        for (let i = 0; i < pPath.length - 1; ++i) {
            const part = pPath[i];

            const info = this.getReadAccessInfo(target, part);

            if (AccessType.NOT_FOUND === info.type) {
                const nextPart = pPath[i + 1];
                this.writeProperty(prop, part, nextPart.asIndex ? [] : {});
            }

            prop = this.readProperty(prop, part);

            if (!Var.isObjectOrFunction(prop)) {
                throw new UnexpectedTypeError(prop, pPath, i + 1);
            }
        }

        return this.writeProperty(prop, pPath.last, value);
    }

    public isReadable(target: any, path: Path) {
        const pPath = PropertyPath.from(path);

        try {
            this.readPropertiesUntil(target, pPath, pPath.length);
            return true;
        } catch (e) {
            if (Var.isInstanceOf(e, PropertyAccessError)) {
                return false;
            }
            throw e;
        }
    }

    public isWritable(target: any, path: Path) {
        const pPath = PropertyPath.from(path);

        try {
            const props = this.readPropertiesUntil(target, pPath, pPath.length - 1);
            const last = props[props.length - 1];
            return Ref.isWritable(last, pPath.last.key);
        } catch (error) {
            if (Var.isInstanceOf(error, PropertyAccessError)) {
                return false;
            }
            throw error;
        }
    }

    protected getAccessInfo(target: any, pathPart: PathElement, methods: string[]): AccessInfo {
        const key = pathPart.key;

        const access: AccessInfo = {
            type: AccessType.NOT_FOUND,
            key,
        };

        if (key in target) {
            access.type = AccessType.PROPERTY;
            access.key = key;
        }

        // if (Var.isPlainObject(object) || Var.isPlainArray(object)) {
        //     return access;
        // }

        for (const method of methods) {
            if (Ref.hasMethod(target, method)) {
                access.type = AccessType.METHOD;
                access.key = method;
                break;
            }
        }

        return access;
    }

    protected getReadAccessInfo(target: any, path: PathElement) {
        const camelProp = Str.upperFirst(Str.camelCase(path));

        return this.getAccessInfo(target, path, [
            "get" + camelProp, // get method: obj.getParent()
            "is" + camelProp, // obj.isParent()
            "has" + camelProp, // obj.hasParent()
        ]);
    }

    protected getWriteAccessInfo(target: any, path: PathElement) {
        const camelProp = Str.upperFirst(Str.camelCase(path));

        return this.getAccessInfo(target, path, [
            "set" + camelProp, // set method: obj.setParent(node)
            Str.lowerFirst(camelProp), // getsetter: obj.parent(node)
        ]);
    }

    protected readProperty(target: any, part: PathElement) {
        const access = this.getReadAccessInfo(target, part);
        const key = access.key;

        switch (access.type) {
            case AccessType.METHOD:
                return target[key]();
            case AccessType.PROPERTY:
                return target[key];
            case AccessType.NOT_FOUND:
            // todo
            default:
                return;
        }
    }

    protected writeProperty(target: any, part: PathElement, value: any) {
        const access = this.getWriteAccessInfo(target, part);
        const key = access.key;

        switch (access.type) {
            case AccessType.METHOD:
                target[key](value);
                break;
            case AccessType.PROPERTY:
            case AccessType.NOT_FOUND:
            default:
                target[key] = value;
                break;
        }
    }

    protected readPropertiesUntil(target: any, pPath: PropertyPath, lastIndex: number) {
        if (Var.isPrimitive(target)) {
            throw new UnexpectedTypeError(target, pPath, 0);
        }

        const result = [target];

        for (let i = 0; i < lastIndex; ++i) {
            const pKey = pPath[i];

            target = this.readProperty(target, pKey);
            if (i < pPath.length - 1 && Var.isPrimitive(target)) {
                throw new UnexpectedTypeError(target, pPath, i + 1);
            }

            result.push(target);
        }

        return result;
    }
}
