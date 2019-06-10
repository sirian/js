import {Compiler} from "../Compiler";
import {IExpressionFunction} from "../IExpressionFunction";
import {Node} from "./Node";

export class ConstantNode extends Node<{}, {value: any}> {
    protected isIdentifier: boolean;

    public constructor(value: any, isIdentifier: boolean = false) {
        super({}, {value});
        this.isIdentifier = isIdentifier;
    }

    public compile(compiler: Compiler) {
        compiler.repr(this.options.value);
    }

    public evaluate(functions: Record<string, IExpressionFunction>, values: Record<string, any>) {
        return this.options.value;
    }
}
