import {Args, Awaited, Return} from "@sirian/ts-extra-types";
import {XPromise} from "@sirian/xpromise";
import {AbstractTransport} from "./AbstractTransport";
import {PayloadType, ResponseErrorPayload, ResponsePayload} from "./Payload";
import {TransportEvent} from "./TransportEvent";

export type RPCProtocol = { [id: string]: [any[], any] };
export type RPCParams<T extends RPCProtocol, K extends keyof T> = T[K][0];
export type RPCResult<T extends RPCProtocol, K extends keyof T> = T[K][1];
export type RpcHandler<T extends RPCProtocol, P extends keyof T> = (...params: RPCParams<T, P>) => RPCResult<T, P>;
export type RPCHandlers<T extends RPCProtocol> = { [P in keyof T]: RpcHandler<T, P> };

export type RPCProtocolFromHandlers<T> = {
    [P in keyof T]: [Args<T[P]>, Awaited<Return<T[P]>>]
};

export class Server<T extends RPCProtocol> {
    protected handlers: RPCHandlers<T>;

    constructor(handlers: RPCHandlers<T>) {
        this.handlers = {...handlers};
    }

    public addTransport(transport: AbstractTransport) {
        transport.onMessage.addListener((e) => this.handle(e));
    }

    public handle<K extends keyof T>(event: TransportEvent<T, K>) {
        const payload = event.payload;

        if (PayloadType.REQUEST !== payload?.[0]) {
            return;
        }

        const [_, id, method, params] = payload;

        return XPromise.wrap(() => this.handlers[method](...params))
            .then((r) => [PayloadType.RESPONSE, id, true, r] as ResponsePayload<T, K>)
            .catch((e) => [PayloadType.RESPONSE, id, false, e] as ResponseErrorPayload)
            .then((response) => event.reply(response));
    }
}
