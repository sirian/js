import {Debouncer} from "../../src";

test("", () => {
    jest.useFakeTimers();

    let now = 0;
    setInterval(() => now++, 1);
    const calls: Array<[string, number]> = [];
    const fn = (x: string) => calls.push([x, now]);

    const debounced = Debouncer.debounce(fn, {
        hasher: (obj, args) => args[0],
    });

    debounced("zoo");
    setTimeout(() => debounced("bar"), 100);

    debounced("foo");
    setTimeout(() => debounced("foo"), 150);

    jest.advanceTimersByTime(1000);

    expect(calls).toStrictEqual([
        ["zoo", 300],
        ["foo", 300],
        ["bar", 400],
    ]);
});
