import {Obj} from "@sirian/common";
import {Compiler} from "../Compiler";
import {IExpressionFunction} from "../IExpressionFunction";
import {Node} from "./Node";

export class FunctionNode extends Node<{ args: Node }, { name: string }> {
    public constructor(name: string, args: Node) {
        super({args}, {name});
    }

    public compile(compiler: Compiler) {
        const args: string[] = [];
        const argsNode = this.nodes.args;
        for (const node of Obj.values(argsNode.nodes)) {
            args.push(compiler.subcompile(node));
        }

        const fn = compiler.getFunction(this.options.name);

        compiler.raw(fn.compile(...args));
    }

    public evaluate(functions: Record<string, IExpressionFunction>, values: Record<string, any>) {
        const args = [];
        const options = this.options;
        const argsNode = this.nodes.args;
        for (const node of Obj.values(argsNode.nodes)) {
            args.push(node.evaluate(functions, values));
        }

        const fn = functions[options.name];
        return fn.evaluate(...args);
    }
}
