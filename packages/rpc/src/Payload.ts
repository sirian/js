import {RPCParams, RPCProtocol, RPCResult} from "./Server";

export const enum PayloadType {
    REQUEST,
    RESPONSE,
}

export interface MessagePayload {
    readonly id: number;
}

export type Payload<T extends RPCProtocol, K extends keyof T> = RequestPayload<T, K> | ResponsePayload<T, K>;

export interface RequestPayload<T extends RPCProtocol, K extends keyof T> extends MessagePayload {
    type: PayloadType.REQUEST;
    method: K;
    params: RPCParams<T, K>;
}

export type ResponsePayload<T extends RPCProtocol, K extends keyof T> = ResponseOkMessage<T, K> | ResponseErrorPayload;

export interface ResponseOkMessage<T extends RPCProtocol, K extends keyof T> extends MessagePayload {
    type: PayloadType.RESPONSE;
    ok: true;
    result: RPCResult<T, K>;
}

export interface ResponseErrorPayload extends MessagePayload {
    type: PayloadType.RESPONSE;
    ok: false;
    result: any;
}
