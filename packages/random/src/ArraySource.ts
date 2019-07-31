import {IRandomSource} from "./Random";

export class ArraySource implements IRandomSource {
    protected data: ArrayLike<number>;
    protected index = 0;

    constructor(data: ArrayLike<number>) {
        this.data = data;
    }

    public uint8() {
        const {index, data} = this;
        this.index = (index + 1) % data.length;
        return data[index];
    }
}
