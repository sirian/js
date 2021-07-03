/* eslint-disable unicorn/no-null */
import {DevToolsFormatter, IDevToolsFormatter} from "./DevToolsFormatter";

export class DevToolsWrapper<T = any, C = any> implements IDevToolsFormatter<T, C> {
    public target: DevToolsFormatter<T, C>;

    constructor(target: DevToolsFormatter<T, C>) {
        this.target = target;
    }

    public header(object: T, config?: C) {
        const cfg = this.resolveConfig(object, config);

        return cfg ? this.target.header(object, cfg) : null;
    }

    public hasBody(object: T, config?: C) {
        const cfg = this.resolveConfig(object, config);

        return !!cfg && this.target.hasBody(object, cfg);
    }

    public body(object: T, config?: C) {
        const cfg = this.resolveConfig(object, config);
        return cfg ? this.target.body(object, cfg) : null;
    }

    protected resolveConfig(object: T, config?: C) {
        return this.target.resolveConfig(object, config);
    }
}
