import {RPCProtocolFromHandlers, Server} from "../../src";
import {CallbackTransport} from "../../src/CallbackTransport";
import Client from "../../src/Client";

describe("Server", () => {
    const handlers = {
            add: (x: number, y: number) => x + y,
            err: async () => { throw new Error("foo"); },
            timeout: (x) => new Promise((resolve) => setTimeout(() => resolve(x), 10)),
        }
    ;

    const t1 = new CallbackTransport(async (p) => t2.dispatch(p));
    const t2 = new CallbackTransport(async (p) => t1.dispatch(p));

    const server = new Server(handlers);
    server.addTransport(t1);
    const client = new Client<RPCProtocolFromHandlers<typeof handlers>>(t2);

    test("", async () => {
        expect(await client.invoke("add", 3, 2)).toBe(5);
    });

    test("", async () => {
        expect(await client.invoke({
            method: "timeout",
            params: [3],
            timeoutMS: 30,
        })).toBe(3);

        await expect(async () => client.invoke({
            method: "timeout",
            params: [3],
            timeoutMS: 3,
        })).rejects.toThrow(Error);
    });

    test("", async () => {
        await expect(async () => client.invoke("err")).rejects.toThrowError("foo");
    });
});
