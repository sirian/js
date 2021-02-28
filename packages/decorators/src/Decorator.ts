import {Descriptor, isArray, isConstructor, isNumber, isObjectOrFunction, isString, isSymbol} from "@sirian/common";
import {Args, Return} from "@sirian/ts-extra-types";

export const enum DecoratorType {
    CLASS,
    PROPERTY,
    METHOD,
    PARAMETER,
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

export const isDecoratorArgs = <T extends DecoratorType>(type: T, args: any[]): args is Args<Decorators[T]> => {
    if (!isArray(args)) {
        return false;
    }

    const [a1, a2, a3] = args;

    const len = args.length;

    if (1 === len) {
        return DecoratorType.CLASS === type && isConstructor(a1);
    }

    if (2 === len || 3 === len) {
        if (!isObjectOrFunction(a1) || !isString(a2) && !isSymbol(a2)) {
            return false;
        }

        if (DecoratorType.PROPERTY === type) {
            return undefined === a3 || Descriptor.isDescriptor(a3);
        }
        if (DecoratorType.METHOD === type) {
            return Descriptor.isDescriptor(a3);
        }
        if (DecoratorType.PARAMETER === type) {
            return isNumber(a3);
        }
    }

    return false;
};

export const createDecorator = <T extends DecoratorType, F extends DecoratorFactory<T>>(type: T, callback: F) =>
    (((...args: any[]) =>
        isDecoratorArgs(type, args)
        ? (callback() as F)(...args)
        : callback(...args)) as F & Return<F>);

export const classDecorator = <F extends DecoratorFactory<DecoratorType.CLASS>>(callback: F) =>
    createDecorator(DecoratorType.CLASS, callback);

export const methodDecorator = <F extends DecoratorFactory<DecoratorType.METHOD>>(callback: F) =>
    createDecorator(DecoratorType.METHOD, callback);

export const parameterDecorator = <F extends DecoratorFactory<DecoratorType.PARAMETER>>(callback: F) =>
    createDecorator(DecoratorType.PARAMETER, callback);

export const propertyDecorator = <F extends DecoratorFactory<DecoratorType.PROPERTY>>(callback: F) =>
    createDecorator(DecoratorType.PROPERTY, callback);
