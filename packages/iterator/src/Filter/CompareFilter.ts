import {Var} from "@sirian/common";
import {IFilter} from "./Filter";

export const enum Operator {
    GT = ">",
    LT = "<",
    GTE = ">=",
    LTE = "<=",
    EQ = "===",
    NE = "!=",
}

export type ComparePredicate<T = any> = (x: T, y: T) => boolean;

export class CompareFilter<T = any> implements IFilter<T> {
    protected tests: Record<Operator, ComparePredicate> = {
        [Operator.GT]: (x, y) => x > y,
        [Operator.LT]: (x, y) => x < y,
        [Operator.GTE]: (x, y) => x >= y,
        [Operator.LTE]: (x, y) => x <= y,
        [Operator.EQ]: (x, y) => x === y,
        [Operator.NE]: (x, y) => x !== y,
    };

    private target?: T;
    private operator = Operator.EQ;

    public getTarget() {
        return this.target;
    }

    public setTarget(target: T) {
        this.target = target;
    }

    public getOperator() {
        return this.operator;
    }

    public setOperator(operator: Operator) {
        if (!this.hasOperator(operator)) {
            throw new Error(`Operator "${operator}" not supported`);
        }
        this.operator = operator;
    }

    public test(value: T) {
        const fn = this.tests[this.operator];

        return fn(value, this.target);
    }

    public hasOperator(operator: Operator) {
        return Var.hasOwn(this.tests, operator);
    }
}
