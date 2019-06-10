import {Expression} from "./Expression";
import {Node} from "./nodes";

export class ParsedExpression extends Expression {
    public readonly nodes: Node;

    public constructor(expression: string, nodes: Node) {
        super(expression);

        this.nodes = nodes;
    }

}
