/* eslint-disable unicorn/no-null */
import {assign, deleteProp, entriesOf, hasOwn, isPropertyKey, keysOf, valuesOf} from "@sirian/common";
import {ParameterNotFoundError} from "./Error";

export class ParameterBag<T extends Record<string | number, any>> {
    protected params: Partial<T> = {};

    constructor(params: Partial<T> = {}) {
        this.set(params);
    }

    public clear() {
        this.params = {} as any;
        return this;
    }

    public set(params?: Partial<T>): this;
    public set<K extends keyof T>(key: K, value: T[K]): this;
    public set(paramsOrKey: any, value?: any) {
        if (isPropertyKey(paramsOrKey)) {
            this.params[paramsOrKey as keyof T] = value;
        } else {
            assign(this.params, paramsOrKey);
        }

        return this;
    }

    public has<K extends keyof T>(key: K | PropertyKey) {
        return hasOwn(this.params, key);
    }

    public get<K extends keyof T>(key: K): T[K];
    public get<K extends keyof T, U>(key: K, defaultValue?: U): T[K] | U;
    public get(key: keyof T, defaultValue?: any) {
        if (!this.has(key)) {
            if (undefined === defaultValue) {
                throw new ParameterNotFoundError(key, keysOf(this.params));
            }
            return defaultValue;
        }

        const value = this.params[key];

        return undefined !== value ? value : defaultValue;
    }

    public getString(key: keyof T, defaultValue?: any) {
        const v = this.get(key, defaultValue);
        switch (v) {
            case true:
                return "1";
            case false:
            case null:
            case undefined:
                return "";
            default:
                return "" + v;
        }
    }

    public getAlpha(key: keyof T, defaultValue?: string): string {
        return this.getString(key, defaultValue).replace(/[^a-z]/gi, "");
    }

    public getAlnum(key: keyof T, defaultValue?: string): string {
        return this.getString(key, defaultValue).replace(/[^\da-z]/gi, "");
    }

    public getDigits(key: keyof T, defaultValue?: string): string {
        return this.getString(key, defaultValue).replace(/\D/g, "");
    }

    public getNumber(key: keyof T, defaultValue?: number): number {
        return +this.getString(key, defaultValue);
    }

    public getFloat(key: keyof T, defaultValue?: number): number {
        return parseFloat(this.getString(key, defaultValue));
    }

    public getInt(key: keyof T, defaultValue?: number): number {
        return Math.trunc(this.getNumber(key, defaultValue));
    }

    public getBool(key: keyof T, defaultValue?: boolean) {
        const value = this.get(key, defaultValue);
        switch (typeof value) {
            case "boolean":
                return value;
            case "number":
                return 1 === value;
            case "string":
                return /^(true|1|y|yes|on)$/i.test(value);
            default:
                return false;
        }
    }

    public ensure<K extends keyof T>(key: K, init: () => T[K]) {
        if (!this.has(key)) {
            this.set(key, init());
        }

        return this.get(key);
    }

    public delete<K extends keyof T>(key: K | PropertyKey) {
        deleteProp(this.params, key);
        return this;
    }

    public keys() {
        return keysOf(this.params);
    }

    public values() {
        return valuesOf(this.params);
    }

    public entries() {
        return entriesOf(this.params);
    }

    public* [Symbol.iterator]() {
        return yield* this.entries();
    }

    public all() {
        return {...this.params};
    }
}
