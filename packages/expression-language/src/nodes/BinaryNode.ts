import {Ref} from "@sirian/common";
import {Func} from "@sirian/ts-extra-types";
import {Compiler} from "../Compiler";
import {IExpressionFunction} from "../IExpressionFunction";
import {Node} from "./Node";

export class BinaryNode extends Node<{ left: Node, right: Node }, { operator: string }> {
    protected static operatorAlias: Record<string, string> = {
        and: "&&",
        or: "||",
    };

    protected static functions: Record<string, Func> = {
        "in": (a, b) => -1 !== b.indexOf(a),
        "not in": (a, b) => -1 === b.indexOf(a),
        "matches": (a, b) => !!"".match.call(a, b),
    };

    public compile(compiler: Compiler) {
        let operator = this.options.operator;

        const {left, right} = this.nodes;

        const functions = BinaryNode.functions;
        if (Ref.hasOwn(functions, operator)) {
            compiler
                .raw("(")
                .raw(functions[operator])
                .raw(")(")
                .compile(left)
                .raw(", ")
                .compile(right)
                .raw(")")
            ;

            return;
        }

        const operators = BinaryNode.operatorAlias;
        if (Ref.hasOwn(operators, operator)) {
            operator = operators[operator];
        }

        compiler
            .raw("(")
            .compile(left)
            .raw(" ")
            .raw(operator)
            .raw(" ")
            .compile(right)
            .raw(")")
        ;
    }

    public evaluate(functions: Record<string, IExpressionFunction>, values: Record<string, any>) {
        const operator = this.options.operator;
        const {left, right} = this.nodes;

        const l = left.evaluate(functions, values);

        switch (operator) {
            case "or":
            case "||":
                return l || right.evaluate(functions, values);
            case "and":
            case "&&":
                return l && right.evaluate(functions, values);
        }

        const r = right.evaluate(functions, values);

        switch (operator) {
            case "|":
                return l | r;
            case "^":
                return l ^ r;
            case "&":
                return l & r;
            case "==":
                return l == r; // tslint:disable-line:triple-equals
            case "===":
                return l === r;
            case "!=":
                return l != r; // tslint:disable-line:triple-equals
            case "!==":
                return l !== r;
            case "<":
                return l < r;
            case ">":
                return l > r;
            case ">=":
                return l >= r;
            case "<=":
                return l <= r;
            case "+":
                return l + r;
            case "-":
                return l - r;
            case "*":
                return l * r;
            case "**":
                return l ** r;
            case "/":
                return l / r;
            case "%":
                return l % r;
            case "not in":
            case "in":
            case "matches":
                return BinaryNode.functions[operator](l, r);
        }
    }
}
