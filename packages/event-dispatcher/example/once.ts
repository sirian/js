import {Disposer} from "@sirian/disposer";
import {Event, EventDispatcher} from "../src";

const dispatcher = new EventDispatcher();

dispatcher.once(Disposer.setTimeout(100, () => {
    console.log(111);
}));

dispatcher.once(Disposer.setTimeout(200, () => {
    console.log(222);
}));

setTimeout(() => dispatcher.dispatch(new Event()), 150);
setTimeout(() => dispatcher.dispatch(new Event()), 150);
