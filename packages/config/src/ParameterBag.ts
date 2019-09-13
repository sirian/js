import {Entries, Obj, Ref, Var, XSet} from "@sirian/common";
import {ParameterBagError, ParameterCircularReferenceError, ParameterNotFoundError} from "./Error";

export class ParameterBag<T extends object> {
    protected resolving = new XSet();
    protected parameters!: T;
    protected resolved = false;

    constructor(params?: T) {
        this.parameters = {} as any;
        this.add(params);
    }

    public static escapeValue<T>(value: T): T;
    public static escapeValue(value: any): any {
        if (Var.isString(value)) {
            return value.replace(/%/g, "%%");
        }

        if (Var.isPlainArray(value)) {
            return value.map(ParameterBag.escapeValue);
        }

        if (Var.isPlainObject(value)) {
            Entries
                .from(value)
                .map((k, v) => [k, this.escapeValue(v)])
                .toObject();
        }

        return value;
    }

    public static unescapeValue<T>(value: T): T;
    public static unescapeValue(value: any) {
        if (Var.isString(value)) {
            return value.replace(/%%/g, "%");
        }
        if (Var.isPlainArray(value)) {
            return value.map(ParameterBag.unescapeValue);
        }
        if (Var.isPlainObject(value)) {
            return Entries
                .from(value)
                .map((k, v) => [k, this.unescapeValue(v)])
                .toObject();
        }

        return value;
    }

    public resolve() {
        if (this.resolved) {
            return this;
        }

        try {
            const parameters: Partial<T> = {};
            for (const [key, value] of Obj.entries(this.parameters)) {
                const resolved = this.resolveValue(value as T[keyof T]);
                parameters[key as keyof T] = ParameterBag.unescapeValue(resolved);
            }
            this.parameters = parameters as T;
            this.resolved = true;
        } finally {
            this.resolving.clear();
        }
        return this;
    }

    public clear() {
        this.parameters = {} as any;
        return this;
    }

    public add<U extends object>(parameters?: U): ParameterBag<T & U> {
        Obj.assign(this.parameters, parameters);
        return this as unknown as ParameterBag<T & U>;
    }

    public has(key: PropertyKey) {
        return Ref.hasOwn(this.parameters, key);
    }

    public get<K extends keyof T>(key: K) {
        if (!this.has(key)) {
            throw new ParameterNotFoundError(key);
        }

        return this.parameters[key] as T[K];
    }

    public delete(key: PropertyKey) {
        Ref.delete(this.parameters, key);
        return this;
    }

    public resolveString(value: string): string {
        const resolving = this.resolving;

        return value.replace(/%%|%([^%\s]+)%/g, (text, key) => {
            if ("%%" === text) {
                return "%%";
            }

            if (resolving.has(key)) {
                throw new ParameterCircularReferenceError([...resolving, key]);
            }

            resolving.add(key);

            let resolved: any = this.get(key);

            if (!Var.isString(resolved) && !Var.isNumeric(resolved)) {
                throw new ParameterBagError("A string value must be composed of strings/numbers, "
                    + `but found parameter "${key}" of type ${typeof resolved} inside string value "${value}".`);
            }
            resolved = Var.stringify(resolved);

            try {
                return this.resolved ? resolved : this.resolveString(resolved);
            } finally {
                resolving.delete(key);
            }
        });
    }

    public resolveValue<V>(value: V): V;
    public resolveValue(value: any) {
        if (Var.isString(value) && value.length > 2) {
            return this.resolveString(value);
        }

        if (Var.isPlainArray(value)) {
            return value.map((v) => this.resolveValue(v));
        }

        if (Var.isPlainObject(value)) {
            return Entries
                .from(value)
                .map((k, v) => [this.resolveValue(k), this.resolveValue(v)])
                .toObject();
        }

        return value;
    }
}
