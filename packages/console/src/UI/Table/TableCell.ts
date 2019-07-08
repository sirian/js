import {Var} from "@sirian/common";

export class TableCell {
    protected value: any;

    constructor(value?: any) {
        this.value = value;
    }

    public setValue(value: any) {
        this.value = value;
    }

    public toString() {
        return Var.stringify(this.value);
    }
}
