import {Descriptor, Var} from "@sirian/common";
import {Args, Return} from "@sirian/ts-extra-types";

export enum DecoratorType {
    CLASS = "class",
    PROPERTY = "property",
    METHOD = "method",
    PARAMETER = "parameter",
}

export interface IClassDecoratorParams {
    class: Function;
}

export interface IPropertyDecoratorParams {
    proto: object;
    propertyKey: PropertyKey;
    descriptor?: PropertyDescriptor;
}

export interface IMethodDecoratorParams extends IPropertyDecoratorParams {
    descriptor: PropertyDescriptor;
}

export interface IParameterDecoratorParams {
    parameterIndex: number;
}

export type DecoratorParams = {
    [DecoratorType.CLASS]: IClassDecoratorParams,
    [DecoratorType.PROPERTY]: IPropertyDecoratorParams,
    [DecoratorType.METHOD]: IMethodDecoratorParams,
    [DecoratorType.PARAMETER]: IParameterDecoratorParams,
};

export type Decorators = {
    [DecoratorType.CLASS]: <T extends Function>(fn: T) => T | void,
    [DecoratorType.PROPERTY]: (proto: object, key: PropertyKey, desc?: PropertyDescriptor) => void,
    [DecoratorType.METHOD]: (proto: object, key: PropertyKey, desc: PropertyDescriptor) => PropertyDescriptor | void,
    [DecoratorType.PARAMETER]: (proto: object, key: PropertyKey, index: number) => void,
};

export type DecoratorFactory<T extends DecoratorType> = (...args: any) => Decorators[T];

export class Decorator {
    public static forClass<F extends DecoratorFactory<DecoratorType.CLASS>>(callback: F) {
        return Decorator.create(DecoratorType.CLASS, callback);
    }

    public static forMethod<F extends DecoratorFactory<DecoratorType.METHOD>>(callback: F) {
        return Decorator.create(DecoratorType.METHOD, callback);
    }

    public static forParameter<F extends DecoratorFactory<DecoratorType.PARAMETER>>(callback: F) {
        return Decorator.create(DecoratorType.PARAMETER, callback);
    }

    public static forProperty<F extends DecoratorFactory<DecoratorType.PROPERTY>>(callback: F) {
        return Decorator.create(DecoratorType.PROPERTY, callback);
    }

    public static create<T extends DecoratorType, F extends DecoratorFactory<T>>(type: T, callback: F) {
        return ((...args: any[]) => {
            if (Decorator.isDecoratorArgs(type, args)) {
                const decorator = callback() as any;
                return decorator(...args);
            }

            return callback(...args);
        }) as F & Return<F>;
    }

    public static parseArgs<T extends DecoratorType>(type: T, args: Args<Decorators[T]>): DecoratorParams[T] {
        if (!this.isDecoratorArgs(type, args)) {
            throw new Error(`Could not parse ${type} decorator args "${args}"`);
        }

        if (DecoratorType.CLASS === type) {
            return {class: args[0]} as any;
        }

        const [proto, propertyKey, arg3] = args as any[];

        switch (type) {
            case DecoratorType.METHOD:
            case DecoratorType.PROPERTY:
                return {proto, propertyKey, descriptor: arg3} as any;
            case DecoratorType.PARAMETER:
                return {proto, propertyKey, parameterIndex: arg3} as any;
        }

        throw new Error(`Invalid decorator type "${type}"`);
    }

    public static isDecoratorArgs<T extends DecoratorType>(type: T, args: any[]): args is Args<Decorators[T]> {
        const len = args.length;

        const [a1, a2, a3] = args;

        switch (len) {
            case 1:
                return DecoratorType.CLASS === type && Var.isConstructor(a1);
            case 2:
            case 3:
                if (!Var.isObjectOrFunction(a1)) {
                    return false;
                }

                if (!Var.isString(a2) && !Var.isSymbol(a2)) {
                    return false;
                }

                switch (type) {
                    case DecoratorType.PROPERTY:
                        return undefined === a3 || Descriptor.isDescriptor(a3);

                    case DecoratorType.METHOD:
                        return Descriptor.isDescriptor(a3);

                    case DecoratorType.PARAMETER:
                        return "number" === typeof a3;
                    default:
                        return false;
                }
            default:
                return false;
        }
    }
}
