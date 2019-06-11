import {Obj} from "@sirian/common";
import {Compiler} from "../Compiler";
import {IExpressionFunction} from "../IExpressionFunction";
import {Node} from "./Node";

export class ArrayNode extends Node<Record<number, Node>, {}> {
    protected index = -1;

    constructor(nodes: Node[] = []) {
        super({}, {});
        for (const node of nodes) {
            this.addElement(node);
        }
    }

    public addElement(value: Node) {
        this.nodes[++this.index] = value;
    }

    public compile(compiler: Compiler) {
        compiler.raw("[");
        this.compileArguments(compiler);
        compiler.raw("]");
    }

    public evaluate(functions: Record<string, IExpressionFunction>, values: Record<string, any>) {
        const result = [];
        for (const value of Obj.values(this.nodes)) {
            result.push(value.evaluate(functions, values));
        }

        return result;
    }

    protected compileArguments(compiler: Compiler) {
        let first = true;
        for (const value of Obj.values(this.nodes)) {
            if (!first) {
                compiler.raw(", ");
            }
            first = false;

            compiler.compile(value);
        }
    }
}
