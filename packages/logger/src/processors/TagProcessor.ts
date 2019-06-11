import {LogRecord} from "../LogRecord";
import {ILogProcessor} from "./ILogProcessor";

export class TagProcessor implements ILogProcessor {
    protected tags: Record<string, any>;

    constructor(tags: Record<string, any> | ArrayLike<any>) {
        this.tags = {...tags};
    }

    public process(record: LogRecord) {
        record.extra.tags = {...this.tags};
    }
}
