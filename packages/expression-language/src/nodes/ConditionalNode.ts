import {Compiler} from "../Compiler";
import {IExpressionFunction} from "../IExpressionFunction";
import {Node} from "./Node";

export class ConditionalNode extends Node<{ expr1: Node, expr2: Node, expr3: Node }, {}> {
    public compile(compiler: Compiler) {
        const nodes = this.nodes;
        compiler
            .raw("((")
            .compile(nodes.expr1)
            .raw(") ? (")
            .compile(nodes.expr2)
            .raw(") : (")
            .compile(nodes.expr3)
            .raw("))")
        ;
    }

    public evaluate(functions: Record<string, IExpressionFunction>, values: Record<string, any>) {
        const nodes = this.nodes;
        if (nodes.expr1.evaluate(functions, values)) {
            return nodes.expr2.evaluate(functions, values);
        }

        return nodes.expr3.evaluate(functions, values);
    }
}
