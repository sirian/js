import {Option} from "./Option";

export class FlagOption extends Option<boolean> {
    constructor(...args: any[]) {
        const init = Option.resolveArgs<boolean>(args);

        super({
            default: false,
            defaultValue: true,
            valueRequired: false,
            normalizer: (value) => true,
            ...init,
        });
    }

    public acceptValue() {
        return false;
    }
}
