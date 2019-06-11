import {DataEvent, EventDispatcher} from "../../src";

// tslint:disable:max-classes-per-file

describe("", () => {
    class FooEvent extends DataEvent<boolean> {}

    class BarEvent extends DataEvent<string> {}

    class ZooEvent extends DataEvent<number> {}

    const data: Array<[FooEvent | BarEvent | ZooEvent, string[]]> = [
        [new FooEvent(true), ["foo", "any", "foobar"]],
        [new BarEvent("bar"), ["bar", "any", "foobar"]],
        [new ZooEvent(42), ["any"]],
    ];

    test.each(data)("", (event, expected) => {
        const dispacher = new EventDispatcher<FooEvent | BarEvent | ZooEvent>();
        const result: string[] = [];

        dispacher.addListener({
            filter: [FooEvent],
            callback: (e) => result.push("foo"),
        });

        dispacher.addListener(BarEvent, (e) => result.push("bar"));

        dispacher.addListener((e) => result.push("any"));
        dispacher.addListener({
            filter: [],
            callback: (e) => result.push("never"),
        });

        dispacher.addListener([FooEvent, BarEvent], (e) => result.push("foobar"));

        dispacher.dispatchSync(event);

        expect(result).toStrictEqual(expected);
    });
});
