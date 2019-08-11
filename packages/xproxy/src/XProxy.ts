import {Ref, Var} from "@sirian/common";
import {AnyFunc, Args, Func0, Return} from "@sirian/ts-extra-types";
import {ProxyTrap, XProxyTraps} from "./XProxyTraps";

export type TrapArgs<T, P extends ProxyTrap> = Args<XProxyTraps<T>[P]>;
export type TrapReturn<T, P extends ProxyTrap> = Return<XProxyTraps<T>[P]>;
export type TrapFunc<T, P extends ProxyTrap> = (...args: TrapArgs<T, P>) => TrapReturn<T, P>;

export class XProxy<T extends object> {
    public readonly proxy: T;

    protected target?: T;
    protected targetFactory?: () => T;
    protected handler: ProxyHandler<T>;
    protected traps: XProxyTraps<T>;
    protected revoked = false;
    protected revoker: Func0;

    protected constructor(fakeTarget: {} & any, traps: XProxyTraps<T> = {}) {
        this.traps = {...traps};

        this.handler = {};
        const trapNames = [
            "getOwnPropertyDescriptor", "has", "get", "set", "deleteProperty", "defineProperty",
            "isExtensible", "preventExtensions", "getPrototypeOf", "setPrototypeOf", "ownKeys",
            "apply", "construct",
        ] as const;

        for (const trapName of trapNames) {
            this.handler[trapName] = (...args: any) => this.handle(trapName, ...args);
        }

        const {proxy, revoke} = Proxy.revocable(fakeTarget, this.handler);
        this.revoker = revoke;
        this.proxy = proxy;
    }

    public static forObject<T extends object = any>(traps?: XProxyTraps<T>) {
        return new XProxy<T>({} as any, traps);
    }

    public static forFunction<T extends AnyFunc = any>(traps?: XProxyTraps<T>) {
        return new XProxy<T>(function() {} as any, traps);
    }

    public setTargetFactory(factory: () => T) {
        this.check();
        this.targetFactory = factory;
        return this;
    }

    public addTraps(traps: XProxyTraps<T>) {
        this.check();
        Object.assign(this.traps, traps);
        return this;
    }

    public setTarget(target: T) {
        this.check();
        if (Var.isPrimitive(target)) {
            throw new Error(`Invalid proxy target "${typeof target}"`);
        }

        this.target = target;

        return this;
    }

    public revoke() {
        if (this.revoked) {
            return;
        }
        this.revoked = true;
        delete this.target;
        delete this.targetFactory;
        delete this.traps;
        this.revoker();
    }

    public removeTarget() {
        delete this.target;
    }

    public getTarget() {
        return this.target;
    }

    public ensureTarget() {
        this.check();
        if (this.target) {
            return;
        }

        const factory = this.targetFactory;
        if (!Var.isFunction(factory)) {
            throw new Error("Proxy targetFactory is not a function");
        }

        const target = factory();
        this.setTarget(target);
    }

    protected handle<P extends ProxyTrap>(trapName: P, ...args: TrapArgs<T, P>): TrapReturn<T, P> {
        this.check();
        this.ensureTarget();
        args[0] = this.target;

        if (Ref.hasMethod(this.traps, trapName)) {
            return this.traps[trapName](...args);
        }

        return (Reflect[trapName] as TrapFunc<T, P>)(...args);
    }

    protected check() {
        if (this.revoked) {
            throw new Error("XProxy was revoked");
        }
    }
}
