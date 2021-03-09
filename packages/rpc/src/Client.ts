import {randomUint32, XMap} from "@sirian/common";
import {XPromise} from "@sirian/xpromise";
import {AbstractTransport} from "./AbstractTransport";
import {PayloadType, RequestPayload} from "./Payload";
import {RPCParams, RPCProtocol, RPCResult} from "./Server";
import {TransportEvent} from "./TransportEvent";

export interface InvokeInit {
    timeoutMS?: number;
}

export class Client<T extends RPCProtocol> {
    protected transport: AbstractTransport;
    protected requests: XMap<string, XPromise<RPCResult<T, any>>>;

    constructor(transport: AbstractTransport) {
        this.transport = transport;
        this.requests = new XMap(() => new XPromise());

        transport.onMessage.addListener((e) => this.handleResponse(e));
    }

    public invoke<K extends keyof T>(method: K, params: RPCParams<T, K>, init: InvokeInit = {}): XPromise<RPCResult<T, K>> {
        const id = "" + randomUint32();

        const xPromise = new XPromise();

        this.requests.set(id, xPromise);

        xPromise.finally(() => this.requests.delete(id));

        if (init.timeoutMS) {
            xPromise.setTimeout(init.timeoutMS);
        }

        const payload: RequestPayload<T, K> = [
            PayloadType.REQUEST,
            id,
            method,
            params,
        ];

        this.transport.send(payload);

        return xPromise;
    }

    protected handleResponse<K extends keyof T>(e: TransportEvent<T, K>) {
        const payload = e.payload;

        if (PayloadType.RESPONSE !== payload?.[0]) {
            return;
        }

        const [_, id, ok, result] = payload;

        const r = this.requests.pick(id) as XPromise<RPCResult<T, K>>;

        if (!r) {
            return;
        }

        if (ok) {
            r.resolve(result);
        } else {
            r.reject(result);
        }
    }
}
