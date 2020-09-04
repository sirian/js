import {isObject, XMap} from "@sirian/common";
import {EventEmitter} from "@sirian/event-emitter";
import {XPromise} from "@sirian/xpromise";
import {AbstractTransport} from "./AbstractTransport";
import {PayloadType, RequestPayload} from "./Payload";
import {RPCParams, RPCProtocol, RPCResult} from "./Server";
import {TransportEvent} from "./TransportEvent";

export interface InvokeInit<T extends RPCProtocol, K extends keyof T> {
    method: K;
    params: RPCParams<T, K>;
    timeoutMS?: number;
}

export default class Client<T extends RPCProtocol> extends EventEmitter {
    protected requestId: number = 1;
    protected transport: AbstractTransport;
    protected requests: XMap<number, XPromise<RPCResult<T, any>>>;

    constructor(transport: AbstractTransport) {
        super();
        this.transport = transport;
        this.requests = new XMap();

        transport.onMessage.addListener((e) => this.handleResponse(e));
    }

    public invoke<K extends keyof T>(init: InvokeInit<T, K>): XPromise<RPCResult<T, K>>;
    public invoke<K extends keyof T>(method: K, ...params: RPCParams<T, K>): XPromise<RPCResult<T, K>>;
    public invoke<K extends keyof T>(methodOrInit: K | InvokeInit<T, K>, ...rest: [] | RPCParams<T, K>) {
        const init = isObject(methodOrInit)
                     ? methodOrInit
                     : {method: methodOrInit, params: rest, timeoutMS: 0};

        const {transport, requests} = this;
        const {method, params, timeoutMS} = init;

        const id = this.requestId++;

        const xPromise = new XPromise();
        requests.set(id, xPromise);
        xPromise.finally(() => requests.delete(id));

        if (timeoutMS) {
            xPromise.setTimeout(timeoutMS);
        }

        const payload: RequestPayload<T, K> = {
            type: PayloadType.REQUEST,
            id,
            method,
            params,
        };

        XPromise
            .wrap(() => transport.send(payload))
            .catch((e) => xPromise.reject(e));

        return xPromise;
    }

    protected handleResponse<K extends keyof T>(e: TransportEvent<T, K>) {
        const {payload} = e;

        if (PayloadType.RESPONSE !== payload.type) {
            return;
        }

        const {id, ok, result} = payload;

        const r = this.requests.pick(id) as XPromise<RPCResult<T, K>>;

        if (ok) {
            r.resolve(result);
        } else {
            r.reject(result);
        }
    }
}
