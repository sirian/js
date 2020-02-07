import {hasOwn, Obj} from "@sirian/common";
import {Operator} from "./Operator";

export class Operators {
    public static default = new Operators();

    public readonly unary: Record<string, Operator> = {
        "not": Operator.unary(50),
        "!": Operator.unary(50),
        "-": Operator.unary(500),
        "+": Operator.unary(500),
    };
    public readonly binary: Record<string, Operator> = {
        "or": Operator.left(10),
        "||": Operator.left(10),
        "and": Operator.left(15),
        "&&": Operator.left(15),
        "|": Operator.left(16),
        "^": Operator.left(17),
        "&": Operator.left(18),
        "==": Operator.left(20),
        "===": Operator.left(20),
        "!=": Operator.left(20),
        "!==": Operator.left(20),
        "<": Operator.left(20),
        ">": Operator.left(20),
        ">=": Operator.left(20),
        "<=": Operator.left(20),
        "not in": Operator.left(20),
        "in": Operator.left(20),
        "matches": Operator.left(20),
        "+": Operator.left(30),
        "-": Operator.left(30),
        "*": Operator.left(60),
        "/": Operator.left(60),
        "%": Operator.left(60),
        "**": Operator.right(200),
    };

    public getOperatorNames() {
        return Obj.keys({...this.unary, ...this.binary});
    }

    public hasBinary(name: string) {
        return hasOwn(this.binary, name);
    }

    public hasUnary(name: string) {
        return hasOwn(this.unary, name);
    }
}
