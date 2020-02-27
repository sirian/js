import {ParameterBagError} from "./ParameterBagError";

export class ParameterNotFoundError extends ParameterBagError {
    public readonly key: any;
    public readonly altKeys: any[];

    constructor(key: any, altKeys: any[] = []) {
        let msg = `Parameter "${key}" doesn't exist.`;
        if (altKeys.length) {
            msg += ` Did you mean one of these: ${altKeys.join(", ")}?`;
        }
        super(msg);
        this.key = key;
        this.altKeys = altKeys;
    }
}
