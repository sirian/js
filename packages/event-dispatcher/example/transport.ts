import {DataEvent, EventDispatcher, SimpleEventDispatcher} from "../src";

// tslint:disable
class MessageEvent extends DataEvent<{ type: string, body: any }> {

}

class Transport {
    public onConnected = new SimpleEventDispatcher();
    public onDisconnected = new SimpleEventDispatcher();
    public onMessage = new EventDispatcher<MessageEvent>();

    async connect() {
        // ...
        await this.onConnected.dispatch();
        // ..
        setTimeout(() => this.onDisconnected.dispatch(), 1000);
    }

    public async send(type: string, body: any) {
        await this.onMessage.dispatch(new MessageEvent({type, body}));
    }
}

const transport = new Transport();
transport.onDisconnected.addListener(async () => {
    console.error("Disconnected. Retry");
    await transport.connect();
});

transport.onMessage.addListener((e) => console.log(`message [%o] %O`, e.data.type, e.data.body));

transport.send("foo", "bar");
