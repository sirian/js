import {entriesOf, Str, valuesOf} from "@sirian/common";
import {Compiler} from "../Compiler";
import {IExpressionFunction} from "../IExpressionFunction";

export type Nodes = Record<any, any>;

export class Node<N extends Nodes = Nodes, A extends Record<string, any> = Record<string, any>> {
    public readonly nodes: N;
    public readonly options: A;

    public constructor(nodes: N, options: A) {
        this.nodes = nodes;
        this.options = options;
    }

    public toString() {
        const options = [];

        for (const [name, value] of entriesOf(this.options)) {
            options.push(`${name}: ${Str.stringify(value).replace(/\n/g, "")}`);
        }

        const repr = [this.constructor.name + "(" + options.join(", ")];

        const nodes = valuesOf(this.nodes);
        if (nodes.length) {
            for (const node of nodes) {
                for (const line of Str.stringify(node).split("\n")) {
                    repr.push("    " + line);
                }
            }

            repr.push(")");
        } else {
            repr[0] += ")";
        }

        return repr.join("\n");
    }

    public compile(compiler: Compiler) {
        for (const node of valuesOf(this.nodes)) {
            node.compile(compiler);
        }
    }

    public evaluate(functions: Record<string, IExpressionFunction>, values: Record<string, any>): any {
        return valuesOf(this.nodes)
            .map((node) => node.evaluate(functions, values));
    }
}
