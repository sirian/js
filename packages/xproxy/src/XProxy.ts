import {Ref, Var} from "@sirian/common";
import {AnyFunc, Args, Return} from "@sirian/ts-extra-types";
import {ProxyTrap, ProxyTraps} from "./ProxyTraps";
import {XProxyTraps} from "./XProxyTraps";

export type TrapArgs<T, P extends ProxyTrap> = Args<XProxyTraps<T>[P]>;
export type TrapReturn<T, P extends ProxyTrap> = Return<XProxyTraps<T>[P]>;
export type TrapFunc<T, P extends ProxyTrap> = (...args: TrapArgs<T, P>) => TrapReturn<T, P>;

export class XProxy<T extends object> {
    public readonly proxy: T;

    protected target?: T;
    protected targetFactory?: () => T;
    protected handler: ProxyHandler<T>;
    protected traps: XProxyTraps<T>;

    protected constructor(fakeTarget: object, traps: XProxyTraps<T> = {}) {
        this.traps = {...traps};
        this.handler = this.createHandler();
        this.proxy = new Proxy(fakeTarget as any, this.handler);
    }

    public static forObject<T extends object = any>(traps?: XProxyTraps<T>) {
        return new XProxy<T>({} as any, traps);
    }

    public static forFunction<T extends AnyFunc = any>(traps?: XProxyTraps<T>) {
        return new XProxy<T>(function() {} as any, traps);
    }

    public setTargetFactory(factory: () => T) {
        this.targetFactory = factory;
        return this;
    }

    public addTraps(traps: XProxyTraps<T>) {
        Object.assign(this.traps, traps);
        return this;
    }

    public setTarget(target: T) {
        if (Var.isPrimitive(target)) {
            throw new Error(`Invalid proxy target "${typeof target}"`);
        }

        this.target = target;

        return this;
    }

    public getTarget() {
        return this.target;
    }

    public ensureTarget() {
        if (this.target) {
            return;
        }

        const factory = this.targetFactory;
        if (!factory) {
            throw new Error("Proxy targetFactory is not a function");
        }

        const target = factory();
        this.setTarget(target);
        delete this.targetFactory;
    }

    protected createHandler() {
        const handler: ProxyHandler<T> = {};
        for (const trapName of ProxyTraps) {
            handler[trapName] = (...args: any) => this.applyHandler(trapName, args);
        }
        return handler as Required<ProxyHandler<T>>;
    }

    protected applyHandler<P extends ProxyTrap>(trapName: P, args: TrapArgs<T, P>): TrapReturn<T, P> {
        this.ensureTarget();
        args[0] = this.target;

        if (Ref.hasMethod(this.traps, trapName)) {
            return this.traps[trapName](...args);
        }

        return (Reflect[trapName] as TrapFunc<T, P>)(...args);
    }
}
