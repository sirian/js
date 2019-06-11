import {Compiler} from "../Compiler";
import {IExpressionFunction} from "../IExpressionFunction";
import {Node} from "./Node";

export class NameNode extends Node<{}, {name: string}> {
    constructor(name: string) {
        super({}, {name});
    }

    public compile(compiler: Compiler) {
        compiler.raw(this.options.name);
    }

    public evaluate(functions: Record<string, IExpressionFunction>, values: Record<string, any>) {
        return values[this.options.name];
    }
}
