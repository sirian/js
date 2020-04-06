import {Ctor0, Instance, Overwrite, Primitive} from "@sirian/ts-extra-types";

declare global {
    interface ErrorConstructor {
        captureStackTrace?(targetObject: Object, constructorOpt?: Function): void;
    }
}

export class CustomError extends Error {
    public previous?: Error;

    constructor(message?: Primitive, previous?: Error) {
        super(null == message ? "" : String(message));

        this.previous = previous;

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, new.target);
        }

        this.name = new.target.name;
    }

    public static wrap<T extends Ctor0, E>(this: T, target: E): E extends Error ? E : Overwrite<Instance<T>, E> {
        if (target instanceof Error) {
            return target as any;
        }

        const wrapped = new this();

        if (null == target) {
            return wrapped;
        }
        if (Object(target) !== target) {
            wrapped.message = String(target);
        }

        return Object.assign(wrapped, target);
    }
}
