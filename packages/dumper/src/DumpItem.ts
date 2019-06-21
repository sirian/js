import {Str} from "@sirian/common";

export class DumpItem<T> {
    protected data: T;

    constructor(data: T) {
        this.data = data;
    }

    public toString() {
        return Str.stringify(this.data);
    }
}
