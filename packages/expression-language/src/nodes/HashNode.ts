import {Obj} from "@sirian/common";
import {Compiler} from "../Compiler";
import {IExpressionFunction} from "../IExpressionFunction";
import {Node} from "./Node";

export class HashNode extends Node<Record<number, Node>, {}> {
    protected index = -1;

    constructor() {
        super({}, {});
    }

    public addElement(key: Node, value: Node) {
        this.nodes[++this.index] = key;
        this.nodes[++this.index] = value;
    }

    public compile(compiler: Compiler) {
        compiler.raw("{");
        this.compileArguments(compiler);
        compiler.raw("}");
    }

    public evaluate(functions: Record<string, IExpressionFunction>, values: Record<string, any>) {
        const result: Record<any, any> = {};

        for (const [keyNode, valueNode] of this.getKeyValuePairs()) {
            const key = keyNode.evaluate(functions, values);
            result[key] = valueNode.evaluate(functions, values);
        }

        return result;
    }

    protected getKeyValuePairs() {
        const pairs: Array<[Node, Node]> = [];
        const nodes = Obj.values(this.nodes);

        for (let i = 0; i < nodes.length; i += 2) {
            pairs.push([nodes[i], nodes[i + 1]]);
        }

        return pairs;
    }

    protected compileArguments(compiler: Compiler) {
        let first = true;
        for (const [key, value] of this.getKeyValuePairs()) {
            if (!first) {
                compiler.raw(", ");
            }
            first = false;
            compiler
                .compile(key)
                .raw(": ")
                .compile(value);
        }
    }
}
