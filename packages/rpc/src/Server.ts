import {EventsDispatcher} from "@sirian/event-dispatcher";
import {JSONValue} from "@sirian/ts-extra-types";
import {XPromise} from "@sirian/xpromise";
import {AbstractTransport} from "./AbstractTransport";
import {PayloadType} from "./Payload";
import {RequestEvent} from "./RequestEvent";
import {TransportEvent} from "./TransportEvent";

export type RPCProtocol = Record<string, [JSONValue[], JSONValue]>;
export type RPCParams<T extends RPCProtocol, K extends keyof T> = T[K][0];
export type RPCResult<T extends RPCProtocol, K extends keyof T> = T[K][1];
export type RPCHandlers<T extends RPCProtocol> = { [P in keyof T]: (...params: RPCParams<T, P>) => RPCResult<T, P> };

export type RPCProtocolFromHandlers<T> = {
    [P in keyof T]: T[P] extends (...args: infer A) => infer R
                    ? [A, R]
                    : never
};

export class Server<T extends RPCProtocol> extends EventsDispatcher {
    protected handlers: RPCHandlers<T>;

    constructor(handlers: RPCHandlers<T>) {
        super();

        this.handlers = {...handlers};
    }

    public addTransport(transport: AbstractTransport) {
        transport.onMessage.addListener((e) => this.handle(e));
    }

    public handle<K extends keyof T>(transportEvent: TransportEvent<T, K>) {
        const {payload, transport} = transportEvent;
        if (PayloadType.REQUEST !== payload.type) {
            return;
        }
        const {method, params} = payload;

        const event = new RequestEvent(payload);
        const handler = this.handlers[method];

        return XPromise.wrap(() => handler(...params))
            .then((r) => event.setResult(r))
            .catch((e) => event.setError(e))
            .finally(() => transport.send(event.getResponse()));
    }
}
