import {Ref, Str, Var} from "@sirian/common";
import {PropertyAccessError, UnexpectedTypeError} from "./Error";
import {Path, PropertyPath, PropertyPathPart} from "./PropertyPath";

export const enum AccessType {
    NOT_FOUND,
    PROPERTY,
    METHOD,
}

export interface AccessInfo {
    type: AccessType;
    key: string;
}

export class Property {
    public static readonly instance = new Property();

    public static read(target: object, path: Path) {
        return this.instance.read(target, path);
    }

    public static write(target: object, path: Path, value: any) {
        return this.instance.write(target, path, value);
    }

    public static isReadable(target: object, path: Path) {
        return this.instance.isReadable(target, path);
    }

    public static isWritable(target: object, path: Path) {
        return this.instance.isWritable(target, path);
    }

    public read(target: object, path: Path) {
        const pPath = PropertyPath.from(path);

        const props = this.readPropertiesUntil(target, pPath, pPath.length);

        return props.pop();
    }

    public write(target: object, path: Path, value: any) {
        const pPath = PropertyPath.from(path);

        let prop: any = target;

        for (let i = 0; i < pPath.length - 1; ++i) {
            const pPathPart = pPath.getPart(i);

            prop = this.readProperty(prop, pPathPart);

            if (!Var.isObjectOrFunction(prop)) {
                throw new UnexpectedTypeError(prop, pPath, i + 1);
            }
        }

        return this.writeProperty(prop, pPath.last, value);
    }

    public isReadable(target: object, path: Path) {
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

    public isWritable(target: object, path: Path) {
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

    protected getAccessInfo(object: object, pathPart: PropertyPathPart, methods: string[]) {
        const key = pathPart.key;

        const access: AccessInfo = {
            type: AccessType.NOT_FOUND,
            key,
        };

        if (key in object) {
            access.type = AccessType.PROPERTY;
            access.key = key;
        }

        // if (Var.isPlainObject(object) || Var.isPlainArray(object)) {
        //     return access;
        // }

        for (const method of methods) {
            if (Ref.hasMethod(object, method)) {
                access.type = AccessType.METHOD;
                access.key = method;
                break;
            }
        }

        return access;
    }

    protected getReadAccessInfo(object: object, path: PropertyPathPart) {
        const camelProp = Str.upperFirst(Str.camelCase(path));

        return this.getAccessInfo(object, path, [
            "get" + camelProp, // get method: obj.getParent()
            "is" + camelProp, // obj.isParent()
            "has" + camelProp, // obj.hasParent()
        ]);
    }

    protected getWriteAccessInfo(object: object, path: PropertyPathPart) {
        const camelProp = Str.upperFirst(Str.camelCase(path));

        return this.getAccessInfo(object, path, [
            "set" + camelProp, // set method: obj.setParent(node)
            Str.lowerFirst(camelProp), // getsetter: obj.parent(node)
        ]);
    }

    protected readProperty(target: any, pPathPart: PropertyPathPart) {
        const access = this.getReadAccessInfo(target, pPathPart);
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

    protected writeProperty(target: any, pPathPart: PropertyPathPart, value: any) {
        const access = this.getWriteAccessInfo(target, pPathPart);
        const key = access.key;

        switch (access.type) {
            case AccessType.METHOD:
                target[key](value);
                break;
            case AccessType.PROPERTY:
                target[key] = value;
                break;
            case AccessType.NOT_FOUND:
                target[key] = value;
                break;
        }
    }

    protected readPropertiesUntil(value: any, pPath: PropertyPath, lastIndex: number) {
        if (!Var.isObjectOrFunction(value)) {
            throw new UnexpectedTypeError(value, pPath, 0);
        }

        const result = [value];

        for (let i = 0; i < lastIndex; ++i) {
            const pKey = pPath.getPart(i);

            value = this.readProperty(value, pKey);
            if (i < pPath.length - 1 && !Var.isObjectOrFunction(value)) {
                throw new UnexpectedTypeError(value, pPath, i + 1);
            }

            result.push(value);
        }

        return result;
    }
}
