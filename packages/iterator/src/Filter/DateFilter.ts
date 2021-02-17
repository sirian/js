import {CompareFilter, Operator} from "./CompareFilter";

export class DateFilter extends CompareFilter {
    public constructor(test: string) {
        super();
        const re = /^\s*(==|!=|[<>]=?)?\s*(.+?)\s*$/i;
        const match = test.match(re);
        if (!match) {
            throw new Error(`'Don't understand "${test}" as a date test.`);
        }

        const [/*text*/, op, dt] = match;

        const date = new Date(dt);

        const time = date.getTime();

        if (!isFinite(time)) {
            throw new Error(`"${dt}" is not a valid date.`);
        }

        this.setTarget(time);

        if (op) {
            this.setOperator(op as Operator);
        }

    }
}
