import {
    camelCase,
    hasMethod,
    isInstanceOf,
    isObjectOrFunction,
    isPrimitive,
    isPropWritable,
    last,
    lowerFirst,
    upperFirst,
} from "@sirian/common";
import {Get, GetDeep} from "@sirian/ts-extra-types";
import {PropertyAccessError, UnexpectedTypeError} from "./Error";
import {parsePropertyPath, Path, PathElement, PathKey} from "./PropertyPath";

export type DeepType<T, P extends Path> =
    P extends PathKey ? Get<T, P> :
    P extends PathKey[] ? GetDeep<T, P> :
    never;

export const enum AccessType {
    NOT_FOUND,
    PROPERTY,
    METHOD,
}

export type AccessInfo = [type: AccessType, key: PathKey];

export class PropertyAccessor {
    public modify<T, P extends Path>(target: T, path: P, fn: (value?: DeepType<T, P>) => DeepType<T, P>) {
        const value = this.isReadable(target, path) ? this.read(target, path) : undefined;
        return this.write(target, path, fn(value));
    }

    public read<T, P extends Path>(target: T, path: P): DeepType<T, P> {
        const pPath = parsePropertyPath(path);

        const props = this._readPropertiesUntil(target, pPath, pPath.length);

        return props.pop();
    }

    public write<T, P extends Path>(target: T, path: P, value: DeepType<T, P>) {
        const pPath = parsePropertyPath(path);

        let prop: any = target;

        for (let i = 0; i < pPath.length - 1; ++i) {
            const part = pPath[i];

            const info = this._getReadAccessInfo(target, part);

            if (AccessType.NOT_FOUND === info[0]) {
                const nextPart = pPath[i + 1];
                this._writeProperty(prop, part, nextPart[1] ? [] : {});
            }

            prop = this._readProperty(prop, part);

            if (!isObjectOrFunction(prop)) {
                throw new UnexpectedTypeError(prop, pPath, i + 1);
            }
        }

        return this._writeProperty(prop, last(pPath)!, value);
    }

    public isReadable(target: any, path: Path) {
        const pPath = parsePropertyPath(path);

        try {
            this._readPropertiesUntil(target, pPath, pPath.length);
            return true;
        } catch (e) {
            if (isInstanceOf(e, PropertyAccessError)) {
                return false;
            }
            throw e;
        }
    }

    public isWritable(target: any, path: Path) {
        const pPath = parsePropertyPath(path);

        try {
            const props = this._readPropertiesUntil(target, pPath, pPath.length - 1);
            const lastProp = props[props.length - 1];
            return isPropWritable(lastProp, last(pPath)![0]);
        } catch (error) {
            if (isInstanceOf(error, PropertyAccessError)) {
                return false;
            }
            throw error;
        }
    }

    private _getAccessInfo(target: any, pathPart: PathElement, methods: string[]): AccessInfo {
        // if (Var.isPlainObject(object) || Var.isPlainArray(object)) {
        //     return access;
        // }

        for (const method of methods) {
            if (hasMethod(target, method)) {
                return [AccessType.METHOD, method];
            }
        }

        const key = pathPart[0];

        return [key in target ? AccessType.PROPERTY : AccessType.NOT_FOUND, key];
    }

    private _getReadAccessInfo(target: any, path: PathElement) {
        const camelProp = upperFirst(camelCase(path));

        return this._getAccessInfo(target, path, [
            "get" + camelProp, // get method: obj.getParent()
            "is" + camelProp, // obj.isParent()
            "has" + camelProp, // obj.hasParent()
        ]);
    }

    private _getWriteAccessInfo(target: any, path: PathElement) {
        const camelProp = upperFirst(camelCase(path));

        return this._getAccessInfo(target, path, [
            "set" + camelProp, // set method: obj.setParent(node)
            lowerFirst(camelProp), // getsetter: obj.parent(node)
        ]);
    }

    private _readProperty(target: any, part: PathElement) {
        const [type, key] = this._getReadAccessInfo(target, part);

        if (AccessType.METHOD === type) {
            return target[key]();
        }
        if (AccessType.PROPERTY === type) {
            return target[key];
        }
    }

    private _writeProperty(target: any, part: PathElement, value: any) {
        const [type, key] = this._getWriteAccessInfo(target, part);

        if (AccessType.METHOD === type) {
            target[key](value);
        } else {
            target[key] = value;
        }
    }

    private _readPropertiesUntil(target: any, pPath: PathElement[], lastIndex: number) {
        if (isPrimitive(target)) {
            throw new UnexpectedTypeError(target, pPath, 0);
        }

        const result = [target];

        for (let i = 0; i < lastIndex; ++i) {
            const pKey = pPath[i];

            target = this._readProperty(target, pKey);
            if (i < pPath.length - 1 && isPrimitive(target)) {
                throw new UnexpectedTypeError(target, pPath, i + 1);
            }

            result.push(target);
        }

        return result;
    }
}
