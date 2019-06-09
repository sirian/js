import {DataEvent, EventDispatcher, EventListener, EventListenerObj} from "../../src";

// tslint:disable:max-classes-per-file

describe("", () => {
    class Foo extends DataEvent<"foo"> {}

    class Bar extends DataEvent<"bar"> {}

    class Baz extends DataEvent<"baz"> {}

    const fn = () => void 0;

    const data: Array<[[any, any?], Partial<EventListenerObj<Foo | Bar | Baz>>]> = [
        [[fn], {}],
        [[Baz, fn], {filter: [Baz]}],

        [[[], fn], {filter: []}],
        [[[Baz], fn], {filter: [Baz]}],
        [[[Baz, Bar], fn], {filter: [Baz, Bar]}],

        [[{callback: fn}], {}],
        [[{callback: fn, filter: []}], {filter: []}],
        [[{callback: fn, filter: [Baz]}], {filter: [Baz]}],
        [[{callback: fn, filter: [Baz, Foo]}], {filter: [Baz, Foo]}],
    ];

    test.each(data)("dispatcher.addListener(%O) like %o", (args, expected) => {
        const dispatcher = new EventDispatcher<Foo | Bar | Baz>();
        const listener = dispatcher.addListener(...args);

        expect(listener).toStrictEqual(new EventListener({
            callback: fn,
            ...expected,
        }));
    });
});
