import {Num, stringifyVar} from "@sirian/common";
import {CompareFilter, Operator} from "./CompareFilter";

export class NumberFilter extends CompareFilter {
    constructor(test: string | number) {
        super();

        const re = /^\s*(==|!=|[<>]=?)?\s*([0-9.]+)\s*(?:([kmg])(i?))?\s*$/;
        const match = stringifyVar(test).match(re);

        if (!match) {
            throw new Error(`Don't understand "${test}" as a number test.`);
        }

        const [/*text*/, op, val, suffix, pow2] = match;

        let target = Num.parse(val);

        if (suffix) {
            const power = "kmg".indexOf(suffix[0].toLowerCase());
            const base = pow2 ? 1024 : 1000;

            target *= base ** power;
        }

        this.setTarget(target);

        if (op) {
            this.setOperator(op as Operator);
        }
    }
}
