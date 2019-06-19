import {IRandomSource} from "../Random";

export class ArrayRandomSource implements IRandomSource {
    protected data: ArrayLike<number>;
    protected index = 0;

    constructor(data: ArrayLike<number>) {
        this.data = data;
    }

    public uint8() {
        const index = this.index;
        this.index = (this.index + 1) % this.data.length;
        return this.data[index];
    }
}
