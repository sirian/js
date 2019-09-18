import {AnyFunc, Args, Return} from "@sirian/ts-extra-types";
import {XProxyError} from "./XProxyError";
import {ProxyTrap, XProxyTraps} from "./XProxyTraps";

export type TrapArgs<T, P extends ProxyTrap> = Args<XProxyTraps<T>[P]>;
export type TrapReturn<T, P extends ProxyTrap> = Return<XProxyTraps<T>[P]>;
export type TrapFunc<T, P extends ProxyTrap> = (...args: TrapArgs<T, P>) => TrapReturn<T, P>;

export interface XProxyInit<T> {
    target?: T;
    factory?: () => T;
}

export class XProxy<T extends object> {
    public readonly proxy: T;

    protected target?: T;
    protected factory?: () => T;
    protected revoked = false;

    protected constructor(fakeTarget: object, init: XProxyInit<T>) {
        this.target = init.target;
        this.factory = init.factory;

        const handler: ProxyHandler<T> = {};

        const trapNames = [
            "getOwnPropertyDescriptor", "has", "get", "set", "deleteProperty", "defineProperty",
            "isExtensible", "preventExtensions", "getPrototypeOf", "setPrototypeOf", "ownKeys",
            "apply", "construct",
        ] as const;

        for (const trapName of trapNames) {
            handler[trapName] = (...args: any) => this.handle(trapName, args);
        }

        this.proxy = new Proxy(fakeTarget as any, handler);
    }

    public static forObject<T extends object>(init: XProxyInit<T> = {}) {
        return new XProxy({}, init);
    }

    public static forFunction<T extends AnyFunc>(init: XProxyInit<T> = {}) {
        return new XProxy(() => {}, init);
    }

    public setFactory(factory: () => T) {
        if (!this.revoked) {
            this.factory = factory;
        }
        return this;
    }

    public setTarget(target: T) {
        if (!this.revoked) {
            this.target = target;
        }

        return this;
    }

    public revoke() {
        this.revoked = true;
        delete this.target;
        delete this.factory;
    }

    public isRevoked() {
        return this.revoked;
    }

    public removeTarget() {
        this.target = undefined;
    }

    public getTarget() {
        return this.target;
    }

    public ensureTarget() {
        if (!this.target) {
            const factory = this.factory;
            if ("function" !== typeof factory) {
                throw new XProxyError("XProxy factory 'undefined' is not a function");
            }
            this.target = factory();
        }
        const {target} = this;

        if (target && "object" === typeof this.target || "function" === typeof this.target) {
            return target;
        }

        throw new XProxyError(`Invalid XProxy target '${target}'`);
    }

    protected handle<P extends ProxyTrap>(trapName: P, args: TrapArgs<T, P>): TrapReturn<T, P> {
        if (this.revoked) {
            throw new XProxyError("Cannot perform 'get' on a xProxy that has been revoked");
        }
        args[0] = this.ensureTarget();
        return (Reflect[trapName] as TrapFunc<T, P>)(...args);
    }
}
