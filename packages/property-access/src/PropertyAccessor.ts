import {
    camelCase,
    hasMethod,
    isInstanceOf,
    isObjectOrFunction,
    isPrimitive,
    isPropWritable,
    lowerFirst,
    upperFirst,
} from "@sirian/common";
import {Get, GetDeep} from "@sirian/ts-extra-types";
import {PropertyAccessError, UnexpectedTypeError} from "./Error";
import {Path, PathElement, PathKey, PropertyPath} from "./PropertyPath";

export type DeepType<T, P extends Path> =
    P extends PathKey ? Get<T, P> :
    P extends PathKey[] ? GetDeep<T, P> :
    never;

export const enum AccessType {
    NOT_FOUND,
    PROPERTY,
    METHOD,
}

export interface AccessInfo {
    type: AccessType;
    key: PathKey;
}

export class PropertyAccessor {
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

            if (!isObjectOrFunction(prop)) {
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
            if (isInstanceOf(e, PropertyAccessError)) {
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
            return isPropWritable(last, pPath.last.key);
        } catch (error) {
            if (isInstanceOf(error, PropertyAccessError)) {
                return false;
            }
            throw error;
        }
    }

    private getAccessInfo(target: any, pathPart: PathElement, methods: string[]): AccessInfo {
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
            if (hasMethod(target, method)) {
                access.type = AccessType.METHOD;
                access.key = method;
                break;
            }
        }

        return access;
    }

    private getReadAccessInfo(target: any, path: PathElement) {
        const camelProp = upperFirst(camelCase(path));

        return this.getAccessInfo(target, path, [
            "get" + camelProp, // get method: obj.getParent()
            "is" + camelProp, // obj.isParent()
            "has" + camelProp, // obj.hasParent()
        ]);
    }

    private getWriteAccessInfo(target: any, path: PathElement) {
        const camelProp = upperFirst(camelCase(path));

        return this.getAccessInfo(target, path, [
            "set" + camelProp, // set method: obj.setParent(node)
            lowerFirst(camelProp), // getsetter: obj.parent(node)
        ]);
    }

    private readProperty(target: any, part: PathElement) {
        const {key, type} = this.getReadAccessInfo(target, part);

        if (AccessType.METHOD === type) {
            return target[key]();
        }
        if (AccessType.PROPERTY === type) {
            return target[key];
        }
    }

    private writeProperty(target: any, part: PathElement, value: any) {
        const {key, type} = this.getWriteAccessInfo(target, part);

        if (AccessType.METHOD === type) {
            target[key](value);
        } else {
            target[key] = value;
        }
    }

    private readPropertiesUntil(target: any, pPath: PropertyPath, lastIndex: number) {
        if (isPrimitive(target)) {
            throw new UnexpectedTypeError(target, pPath, 0);
        }

        const result = [target];

        for (let i = 0; i < lastIndex; ++i) {
            const pKey = pPath[i];

            target = this.readProperty(target, pKey);
            if (i < pPath.length - 1 && isPrimitive(target)) {
                throw new UnexpectedTypeError(target, pPath, i + 1);
            }

            result.push(target);
        }

        return result;
    }
}
