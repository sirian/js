import {Event} from "@sirian/event-dispatcher";
import {PayloadType, ResponsePayload} from "./Payload";
import {RPCParams, RPCProtocol, RPCResult} from "./Server";

interface RequestEventInit<T extends RPCProtocol, K extends keyof T> {
    id: number;
    method: K;
    params: RPCParams<T, K>;
}

export class RequestEvent<T extends RPCProtocol, K extends keyof T> extends Event {
    public readonly id: number;
    public readonly method: K;
    public readonly params: RPCParams<T, K>;
    public result?: any;
    public ok?: boolean;

    constructor(init: RequestEventInit<T, K>) {
        super();

        const {id, method, params} = init;

        this.id = id;
        this.method = method;
        this.params = params;
    }

    public setResult(result: RPCResult<T, K>) {
        return this.setHandled(true, result);
    }

    public setError(error: any) {
        return this.setHandled(false, error);
    }

    public setHandled(ok: boolean, data: any) {
        this.ok = ok;
        this.result = data;
        return this;
    }

    public getResponse() {
        const {id, ok, result} = this;
        return {
            id,
            type: PayloadType.RESPONSE,
            ok,
            result,
        } as ResponsePayload<T, K>;
    }
}
