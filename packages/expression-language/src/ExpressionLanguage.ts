import {entriesOf, isFunction, keysOf} from "@sirian/common";
import {Func} from "@sirian/ts-extra-types";
import {Compiler} from "./Compiler";
import {IExpressionFunction} from "./IExpressionFunction";
import {ParsedExpression} from "./ParsedExpression";
import {Parser} from "./Parser";
import {SimpleExpressionFunction} from "./SimpleExpressionFunction";
import {Tokenizer} from "./Tokenizer";

export interface ExpressionLanguageInit {
    functions: Record<string, IExpressionFunction | Func>;
}

export class ExpressionLanguage {
    protected functions: Record<string, IExpressionFunction> = {};
    protected compiler: Compiler;
    protected tokenizer = new Tokenizer();
    protected parser = new Parser();

    constructor(init: Partial<ExpressionLanguageInit> = {}) {
        for (const [name, fn] of entriesOf(init.functions || {})) {
            this.functions[name] = isFunction(fn) ? new SimpleExpressionFunction(fn) : fn;
        }

        this.compiler = new Compiler(this.functions);
    }

    public getFunctionNames() {
        return keysOf(this.functions);
    }

    public compile(expression: string, names: string[] = []) {
        const nodes = this.parse(expression, names).nodes;
        return this.compiler.compile(nodes).getSource();
    }

    public evaluate(expression: string, values: Record<string, any> = {}) {
        const exp = this.parse(expression, keysOf(values));
        return exp.nodes.evaluate(this.functions, values);
    }

    public parse(expression: string, names: string[] = []) {
        const tokens = this.tokenizer.tokenize(expression);
        const nodes = this.parser.parse(tokens, {
            names,
            functions: this.getFunctionNames(),
        });

        return new ParsedExpression(expression, nodes);
    }
}
