import {DataEvent, EventDispatcher} from "../src";

class FooEvent extends DataEvent<boolean> {}

class BarEvent extends DataEvent<string> {}

class ZooEvent extends DataEvent<number> {}

const dispacher = new EventDispatcher<FooEvent | BarEvent | ZooEvent>();

const fn = () => void 0;

dispacher.addListener(fn); // any event

dispacher.addListener(BarEvent, fn); // only instanceof of BarEvent

dispacher.addListener([FooEvent, BarEvent], fn); // only instanceof of FooEvent | BarEvent

const l = dispacher.addListener({
    filter: [ZooEvent],
    callback: fn, // ZooEvent
});

dispacher.addListener({
    filter: [],
    callback: fn, // never since filter is empty array
});

dispacher.addListener({
    callback: fn, // any event
});
