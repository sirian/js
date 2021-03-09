import {RPCParams, RPCProtocol, RPCResult} from "./Server";

export const enum PayloadType {
    REQUEST,
    RESPONSE,
}

export type Payload<T extends RPCProtocol, K extends keyof T> = RequestPayload<T, K> | ResponsePayload<T, K>;

export type RequestPayload<T extends RPCProtocol, K extends keyof T> = [
    type: PayloadType.REQUEST,
    id: string,
    method: K,
    params: RPCParams<T, K>,
];

export type ResponsePayload<T extends RPCProtocol, K extends keyof T> = ResponseOkMessage<T, K> | ResponseErrorPayload;

export type ResponseOkMessage<T extends RPCProtocol, K extends keyof T> = [
    type: PayloadType.RESPONSE,
    id: string,

    ok: true,
    result: RPCResult<T, K>,
];

export type ResponseErrorPayload = [
    type: PayloadType.RESPONSE,
    id: string,
    ok: false,
    result: any,
];
