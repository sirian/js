import {
    Entries,
    entriesOf,
    isNumeric,
    isPlain,
    isPlainArray,
    isPlainObject,
    isString,
    Ref,
    stringifyVar,
} from "@sirian/common";
import {ParameterBagError, ParameterCircularReferenceError, ParameterNotFoundError} from "./Error";
import {ParameterBag} from "./ParameterBag";
import {StrictObject} from "./StrictObject";

export class ResolvableParameterBag<T extends object> extends ParameterBag<T> {
    protected resolved?: T;

    constructor(params?: T) {
        super(params);
    }

    public escape<V>(value: V): V;
    public escape(value: any): any {
        if (isString(value)) {
            return value.replace(/%/g, "%%");
        }

        if (isPlain(value)) {
            for (const [k, v] of entriesOf(value)) {
                value[k] = this.escape(v);
            }
        }

        return value;
    }

    public unescape<V>(value: V): V;
    public unescape(value: any) {
        if (isString(value)) {
            return value.replace(/%%/g, "%");
        }
        if (isPlain(value)) {
            for (const [k, v] of entriesOf(value)) {
                value[k] = this.unescape(v);
            }
        }

        return value;
    }

    public resolve() {
        if (!this.resolved) {
            const resolved: any = {};
            for (const [key, value] of entriesOf(this.params)) {
                resolved[key] = this.resolveValue(value);
            }
            this.params = this.unescape(resolved as T);
            this.resolved = StrictObject.from(resolved as T);
        }

        return this.resolved;
    }

    public get<K extends keyof T>(key: K): T[K] | undefined;
    public get<K extends keyof T>(key: K, defaultValue: T[K]): T[K];
    public get<K extends keyof T>(key: K, ...rest: any[]) {
        if (!this.has(key) && 0 === rest.length) {
            throw new ParameterNotFoundError(key);
        }

        return super.get(key, rest[0]);
    }

    public delete(key: PropertyKey) {
        Ref.delete(this.params, key);
        return this;
    }

    public resolveString(value: string, resolving: string[] = []): string {
        return value.replace(/%%|%([^%\s]+)%/g, (text, key) => {
            if ("%%" === text) {
                return "%%";
            }

            if (resolving.includes(key)) {
                throw new ParameterCircularReferenceError(resolving);
            }

            let resolved: any = this.get(key);

            if (!isString(resolved) && !isNumeric(resolved)) {
                throw new ParameterBagError("A string value must be composed of strings/numbers, "
                    + `but found parameter "${key}" of type ${typeof resolved} inside string value "${value}".`);
            }
            resolved = stringifyVar(resolved);
            resolving.push(stringifyVar(key));
            try {
                return this.resolved ? resolved : this.resolveString(resolved, resolving);
            } finally {
                resolving.pop();
            }
        });
    }

    public resolveValue<V>(value: V, resolving?: string[]): V;
    public resolveValue(value: any, resolving: string[] = []) {
        if (isString(value) && value.length > 2) {
            return this.resolveString(value, resolving);
        }

        if (isPlainArray(value)) {
            return value.map((v) => this.resolveValue(v, resolving));
        }

        if (isPlainObject(value)) {
            return Entries
                .from(value)
                .map((k, v) => [
                    this.resolveValue(k, resolving),
                    this.resolveValue(v, resolving),
                ])
                .toObject();
        }

        return value;
    }
}
