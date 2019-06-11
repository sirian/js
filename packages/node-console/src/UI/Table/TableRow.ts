import {InvalidArgumentError} from "../../Error";
import {KV} from "../../Util";
import {TableCell} from "./TableCell";

export class TableRow {
    protected cells: TableCell[];

    constructor(values: any[] | Record<number, any> = []) {
        this.cells = [];
        for (const [index, cell] of KV.entries(values)) {
            this.set(+index, cell);
        }
    }

    public get(index: number) {
        if (index >= 0 && index < this.cells.length) {
            return this.cells[index];
        }

        throw new InvalidArgumentError(`Index ${index} does not exist at TableRow`);
    }

    public ensure(index: number) {
        for (let i = this.cells.length; i <= index; i++) {
            this.cells[i] = new TableCell();
        }
        return this.cells[index];
    }

    public set(index: number, value: TableCell) {
        this.ensure(index).setValue(value);
    }

    public size() {
        return this.cells.length;
    }
}
