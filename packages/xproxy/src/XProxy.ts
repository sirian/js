import {AnyFunc, Args, Return} from "@sirian/ts-extra-types";
import {XProxyError} from "./XProxyError";
import {ProxyTrap, XProxyTraps} from "./XProxyTraps";

export type TrapArgs<T, P extends ProxyTrap> = Args<XProxyTraps<T>[P]>;
export type TrapReturn<T, P extends ProxyTrap> = Return<XProxyTraps<T>[P]>;
export type TrapFunc<T, P extends ProxyTrap> = (...args: TrapArgs<T, P>) => TrapReturn<T, P>;

export type XProxyFactory<T extends object> = (xProxy: XProxy<T>) => T;
export type XProxyInit<T extends object> = XProxyFactory<T> | {
    target?: T;
    factory?: XProxyFactory<T>;
};

export class XProxy<T extends object> {
    protected static readonly map = new WeakMap<object, XProxy<any>>();

    public readonly proxy: T;

    protected target?: T;
    protected factory?: XProxyFactory<T>;
    protected revoked = false;

    protected constructor(fakeTarget: object, init: XProxyInit<T> = {}) {
        if ("function" === typeof init) {
            this.factory = init;
        } else {
            this.target = init.target;
            this.factory = init.factory;
        }

        const handler: ProxyHandler<T> = {};

        const trapNames = [
            "getOwnPropertyDescriptor", "has", "get", "set", "deleteProperty", "defineProperty",
            "isExtensible", "preventExtensions", "getPrototypeOf", "setPrototypeOf", "ownKeys",
            "apply", "construct",
        ] as const;

        for (const trapName of trapNames) {
            handler[trapName] = (...args: any) => this.handle(trapName, args);
        }

        this.proxy = new Proxy(fakeTarget as T, handler);

        XProxy.map.set(this.proxy, this);
    }

    public static forObject<T extends object>(init: XProxyInit<T> = {}) {
        return new XProxy({}, init).proxy;
    }

    public static forFunction<T extends AnyFunc>(init: XProxyInit<T> = {}) {
        return new XProxy(function() {}, init).proxy;
    }

    public static get<T extends object>(proxy: T) {
        const xProxy = XProxy.map.get(proxy as any);

        if (!xProxy) {
            throw new XProxyError(`XProxy not found for ${proxy}`);
        }

        return xProxy as XProxy<T>;
    }

    public setFactory(factory: () => T) {
        if (!this.revoked) {
            this.factory = factory;
        }
        return this;
    }

    public setTarget(target: T) {
        if (!this.revoked) {
            if (!target || "object" !== typeof target && "function" !== typeof target) {
                throw new XProxyError(`Invalid XProxy target '${target}'`);
            }
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
        delete this.target;
    }

    public getTarget() {
        return this.target;
    }

    public ensureTarget() {
        if (!this.target) {
            const factory = this.factory;
            if ("function" !== typeof factory) {
                throw new XProxyError(`XProxy factory '${factory}' is not a function`);
            }
            this.setTarget(factory(this));
        }

        return this.target;
    }

    protected handle<P extends ProxyTrap>(trapName: P, args: TrapArgs<T, P>): TrapReturn<T, P> {
        if (this.revoked) {
            throw new XProxyError(`Cannot perform '${trapName}' on a xProxy that has been revoked`);
        }
        args[0] = this.ensureTarget();
        return (Reflect[trapName] as TrapFunc<T, P>)(...args);
    }
}
