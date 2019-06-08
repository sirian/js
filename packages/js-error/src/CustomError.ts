interface V8ErrorConstructor {
    captureStackTrace?: (target: object, ctor?: Function) => void;
}

const Err: ErrorConstructor & V8ErrorConstructor = Error;
const Obj = Object;

type ErrCtor = new (message?: string) => Error;

export class CustomError extends Err {
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
    public static wrap<T extends ErrCtor>(this: T, target: string): InstanceType<T>;
    public static wrap<T extends ErrCtor, O extends object>(this: T, o: O): Omit<InstanceType<T>, keyof O> & O;
    public static wrap<T extends ErrCtor>(this: T, target: any) {
        if (target instanceof Err) {
            return target;
        }

        if (null !== target && "object" === typeof target || "function" === typeof target) {
            const error = new this(target.message);
            return Obj.assign(error, target);
        }

        return new this(target);
    }

    public static captureStackTrace(target: Partial<Error>, ctor?: Function) {
        if (Err.captureStackTrace) {
            Err.captureStackTrace(target, ctor);
            return;
        }

        const error = new Err(target.message);

        let stack = error.stack || "";

        if (undefined !== target.name) {
            stack = stack.replace(/^Error:/, target.name);
        }

        Obj.defineProperty(target, "stack", {
            configurable: true,
            enumerable: false,
            writable: true,
            value: stack,
        });
    }
}
