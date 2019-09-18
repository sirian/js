import {Ctor, Overwrite} from "@sirian/ts-extra-types";

declare global {
    interface ErrorConstructor {
        captureStackTrace?(targetObject: Object, constructorOpt?: Function): void;
    }
}

export class CustomError extends Error {
    public previous?: Error;

    constructor(message: string = "", previous?: Error) {
        super(message);

        this.previous = previous;

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, new.target);
        }

        this.name = new.target.name;
    }

    public static wrap<E extends Error>(target: E): E;
    public static wrap<T extends CustomError>(this: Ctor<T, [any]>, target: string): T;
    public static wrap<T extends CustomError, E>(this: Ctor<T, [any]>, e: E): Overwrite<T, E>;
    public static wrap<T extends ErrorConstructor>(this: T, target: any) {
        if (target instanceof Error) {
            return target;
        }

        if ("object" === typeof target) {
            return Object.assign(new this(), target);
        }
        return new this(target);
    }
}
