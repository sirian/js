import {stringifyVar} from "@sirian/common";

export class TableCell {
    protected value: any;

    constructor(value?: any) {
        this.value = value;
    }

    public setValue(value: any) {
        this.value = value;
    }

    public toString() {
        return stringifyVar(this.value);
    }
}
