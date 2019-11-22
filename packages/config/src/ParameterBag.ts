import {Obj, Ref, Var} from "@sirian/common";
import {ParameterNotFoundError} from "./Error";

export class ParameterBag<T extends Record<string | number, any>> {
    protected params: Partial<T>;

    constructor(params: Partial<T> = {}) {
        this.params = {};
        this.set(params);
    }

    public clear() {
        this.params = {} as any;
        return this;
    }

    public set(params?: Partial<T>): this;
    public set<K extends keyof T>(key: K, value: T[K]): this;
    public set(paramsOrKey: any, value?: any) {
        if (Var.isPropertyKey(paramsOrKey)) {
            this.params[paramsOrKey as keyof T] = value;
        } else {
            Obj.assign(this.params, paramsOrKey);
        }

        return this;
    }

    public has<K extends keyof T>(key: K | PropertyKey) {
        return Ref.hasOwn(this.params, key);
    }

    public get<K extends keyof T>(key: K): T[K];
    public get<K extends keyof T>(key: K, defaultValue?: T[K]): T[K];
    public get<K extends keyof T>(key: K, defaultValue?: T[K]) {
        if (!this.has(key)) {
            if (undefined === defaultValue) {
                throw new ParameterNotFoundError(key);
            }
            return defaultValue;
        }

        const value = this.params[key];

        return undefined !== value ? value : defaultValue;
    }

    public ensure<K extends keyof T>(key: K, init: () => T[K]) {
        if (!this.has(key)) {
            const value = init();
            this.set(key, value);
        }

        return this.get(key);
    }

    public delete<K extends keyof T>(key: K | PropertyKey) {
        Ref.delete(this.params, key);
        return this;
    }

    public keys() {
        return Obj.keys(this.params);
    }

    public values() {
        return Obj.values(this.params);
    }

    public entries() {
        return Obj.entries(this.params);
    }

    public* [Symbol.iterator]() {
        return yield* this.entries();
    }

    public all() {
        return {...this.params};
    }
}
