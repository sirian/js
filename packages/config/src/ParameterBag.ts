import {Entries, Obj, Ref, Var, XSet} from "@sirian/common";
import {ParameterCircularReferenceError, ParameterNotFoundError} from "./Error";

export class ParameterBag<T extends Record<any, any>> {
    protected resolving = new XSet();
    protected parameters: Partial<T> = {};
    protected resolved = false;

    constructor(params?: T) {
        if (params) {
            this.add(params);
        }
    }

    public resolve() {
        if (this.resolved) {
            return;
        }

        for (const [key, value] of Obj.entries(this.parameters)) {
            this.parameters[key] = this.unescapeValue(this.resolveValue(value));
        }

        this.resolved = true;
        this.resolving.clear();
        return this;
    }

    public add<U extends Record<any, any>>(parameters: U): ParameterBag<T & U> {
        Obj.assign(this.parameters, parameters);
        return this as ParameterBag<T & U>;
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
                throw new Error("A string value must be composed of strings/numbers, "
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

    public resolveValue(value: any): any {
        if (Var.isString(value) && value.length > 2) {
            return this.resolveString(value);
        }

        if (Var.isArray(value)) {
            return value.map((v) => this.resolveValue(v));
        }

        if (Var.isObject(value)) {
            return Entries
                .from(value)
                .map((k, v) => [this.resolveValue(k), this.resolveValue(v)])
                .toObject();
        }

        return value;
    }

    public escapeValue(value: any): any {
        if (Var.isString(value)) {
            return value.replace(/%/g, "%%");
        }

        if (Var.isArray(value)) {
            return value.map((v) => this.escapeValue(v));
        }

        if (Var.isObject(value)) {
            Entries
                .from(value)
                .map((k, v) => [k, this.escapeValue(v)])
                .toObject();
        }

        return value;
    }

    public unescapeValue(value: any): any {
        if (Var.isString(value)) {
            return value.replace(/%%/g, "%");
        }
        if (Var.isArray(value)) {
            return value.map((v) => this.unescapeValue(v));
        }
        if (Var.isObject(value)) {
            return Entries
                .from(value)
                .map((k, v) => [k, this.unescapeValue(v)])
                .toObject();
        }

        return value;
    }
}
