import {throwError} from "@sirian/common";
import {RPCProtocolFromHandlers, Server} from "../../src";
import {CallbackTransport} from "../../src/CallbackTransport";
import Client from "../../src/Client";

describe("Server", () => {
    const handlers = {
        add: (x: number, y: number) => x + y,
        err: () => throwError("Foo"),
    };

    test("", async () => {
        const t1 = new CallbackTransport(async (p) => t2.dispatch(p));
        const t2 = new CallbackTransport(async (p) => t1.dispatch(p));

        const server = new Server(handlers);
        server.addTransport(t1);
        const client = new Client<RPCProtocolFromHandlers<typeof handlers>>(t2);

        expect(await client.invoke("add", 3, 2)).toBe(5);
        try {
            await client.invoke("err");
        } catch (e) {
            expect(e).toBe("Foo");
        }
    });
});
