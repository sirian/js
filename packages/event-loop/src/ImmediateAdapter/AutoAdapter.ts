import {TaskCallback} from "../AbstractTimeout";
import {ImmediateAdapter} from "../Immediate";
import {MessagePortAdapter, NativeImmediateAdapter, PostMessageAdapter, TimeoutAdapter} from "./";

export class AutoAdapter implements ImmediateAdapter {
    protected adapter: ImmediateAdapter;

    constructor() {
        const adapters = [
            NativeImmediateAdapter,
            MessagePortAdapter,
            PostMessageAdapter,
            TimeoutAdapter,
        ] as const;

        const adapter = adapters.find((a) => a.supports());

        if (!adapter) {
            throw new Error(`Could not resolve adapter`);
        }

        this.adapter = new adapter();
    }

    public clear(id: any) {
        return this.adapter.clear(id);
    }

    public set(fn: TaskCallback) {
        return this.adapter.set(fn);
    }
}
