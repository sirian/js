import {Compiler} from "../Compiler";
import {IExpressionFunction} from "../IExpressionFunction";
import {Node} from "./Node";

export class UnaryNode extends Node {
    protected static operators: Record<string, string> = {
        "!": "!",
        "not": "!",
        "+": "+",
        "-": "-",
    };

    public constructor(operator: string, node: Node) {
        super({node}, {operator});
    }

    public compile(compiler: Compiler) {
        compiler
            .raw("(")
            .raw(UnaryNode.operators[this.options.operator])
            .compile(this.nodes.node)
            .raw(")")
        ;
    }

    public evaluate(functions: Record<string, IExpressionFunction>, values: Record<string, any>) {
        const value = this.nodes.node.evaluate(functions, values);

        switch (this.options.operator) {
            case "not":
            case "!":
                return !value;
            case "-":
                return -value;
        }

        return value;
    }

    public toArray() {
        return [
            "(",
            this.options.operator + " ",
            this.nodes.node,
            ")",
        ];
    }
}
