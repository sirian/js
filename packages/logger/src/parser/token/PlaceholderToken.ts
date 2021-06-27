import {BaseToken} from "./BaseToken";

export class PlaceholderToken extends BaseToken {
    public readonly path?: string | number;
    public readonly type?: string;
    public readonly options: string;

    constructor(path?: string | number, type?: string, options = "", text = "") {
        super(text);
        this.path = path;
        this.type = type;
        this.options = options;
    }
}
