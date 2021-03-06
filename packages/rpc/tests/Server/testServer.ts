/* eslint-disable @typescript-eslint/no-misused-promises,@typescript-eslint/require-await */
import {CallbackTransport, Client, RPCProtocolFromHandlers, Server} from "../../src";

describe("Server", () => {
    const handlers = {
            add: (x: number, y: number) => x + y,
            err: async () => { throw new Error("foo"); },
            timeout: (x: unknown) => new Promise((resolve) => setTimeout(() => resolve(x), 10)),
        }
    ;

    const t1: CallbackTransport = new CallbackTransport(async (p) => t2.dispatch(p));
    const t2: CallbackTransport = new CallbackTransport(async (p) => t1.dispatch(p));

    const server = new Server(handlers);
    server.addTransport(t1);
    const client = new Client<RPCProtocolFromHandlers<typeof handlers>>(t2);

    test("", async () => {
        expect(await client.invoke("add", [3, 2])).toBe(5);
    });

    test("", async () => {
        expect(await client.invoke("timeout", [3], {
            timeoutMS: 30,
        })).toBe(3);

        await expect(async () => client.invoke("timeout", [3], {
            timeoutMS: 3,
        })).rejects.toThrow(Error);
    });

    test("", async () => {
        await expect(async () => client.invoke("err", [])).rejects.toThrowError("foo");
    });
});
