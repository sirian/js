export class Expression {
    public readonly expression: string;

    public constructor($expression: string) {
        this.expression = $expression;
    }

    public toString() {
        return this.expression;
    }
}
