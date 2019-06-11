export enum OperatorType {
    UNARY,
    LEFT,
    RIGHT,
}

export class Operator {
    public readonly precedence: number;
    public readonly type: OperatorType;

    constructor(precedence: number, type: OperatorType) {
        this.precedence = precedence;
        this.type = type;
    }

    public static left(precedence: number) {
        return new Operator(precedence, OperatorType.LEFT);
    }

    public static right(precedence: number) {
        return new Operator(precedence, OperatorType.RIGHT);
    }

    public static unary(precedence: number) {
        return new Operator(precedence, OperatorType.UNARY);
    }
}
