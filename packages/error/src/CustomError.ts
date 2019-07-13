import {Instance} from "@sirian/ts-extra-types";

type ErrCtor = new (message?: string) => Error;

export class CustomError extends Error {
    public name: string;
    public message: string;
    public previous?: Error;

    constructor(message: string = "", previous?: Error) {
        super(message);

        const ctor = new.target;

        this.name = ctor.name;
        this.message = message;
        this.previous = previous;

        if (!this.stack) {
            CustomError.captureStackTrace(this, ctor);
        }
    }

    public static wrap<E extends Error>(target: E): E;
    public static wrap<T extends ErrCtor>(this: T, target: string): Instance<T>;
    public static wrap<T extends ErrCtor, O extends object>(this: T, o: O): Omit<Instance<T>, keyof O> & O;

    public static wrap<T extends ErrCtor>(this: T, target: any) {
        if (target instanceof Error) {
            return target;
        }

        if (null !== target && "object" === typeof target || "function" === typeof target) {
            const error = new this(target.message);
            return Object.assign(error, target);
        }

        return new this(target);
    }

    public static captureStackTrace(target: Partial<Error>, ctor?: Function) {
        if ("function" === typeof (Error as any).captureStackTrace) {
            (Error as any).captureStackTrace(target, ctor);
            return;
        }

        const error = new Error(target.message);

        let stack = error.stack || "";

        if (undefined !== target.name) {
            stack = stack.replace(/^Error:/, target.name);
        }

        Object.defineProperty(target, "stack", {
            configurable: true,
            enumerable: false,
            writable: true,
            value: stack,
        });
    }
}
