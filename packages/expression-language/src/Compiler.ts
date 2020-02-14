import {entriesOf, isArray, isObject, isPrimitive, isString, Str} from "@sirian/common";
import {IExpressionFunction} from "./IExpressionFunction";
import {Node} from "./nodes";

export class Compiler {
    protected source: string = "";
    protected functions: Record<string, IExpressionFunction>;

    public constructor(functions: Record<string, IExpressionFunction>) {
        this.functions = functions;
    }

    public getFunction(name: string) {
        return this.functions[name];
    }

    public getSource() {
        return this.source;
    }

    public reset() {
        this.source = "";

        return this;
    }

    public compile(node: Node) {
        node.compile(this);

        return this;
    }

    public subcompile(node: Node) {
        const current = this.source;
        this.source = "";

        node.compile(this);

        const source = this.source;
        this.source = current;

        return source;
    }

    public raw(value: any) {
        this.source += Str.stringify(value);

        return this;
    }

    public string(value: string) {
        this.source += Str.wrap(value, `"`);

        return this;
    }

    public repr<T>(value: T) {
        if (isString(value)) {
            return this.string(value);
        }

        if (isPrimitive(value)) {
            return this.raw(value);
        }

        if (isArray(value)) {
            this.raw("[");
            let first = false;

            for (const v of value) {
                if (first) {
                    this.raw(",");
                }
                first = false;
                this.repr(v);
            }

            this.raw("]");

            return this;
        }

        if (isObject(value)) {
            this.raw("{");
            let first = false;

            for (const [k, v] of entriesOf(value)) {
                if (first) {
                    this.raw(",");
                }
                first = false;
                this.repr(k);
                this.raw(":");
                this.repr(v);
            }

            this.raw("}");

            return this;
        }

        throw new Error();
    }
}
