import {debounce} from "../../src";

test("debounce no overlaps between instances", () => {
    const delay = 10;
    class Foo {
        public calls: Array<[number, number]> = [];

        @debounce(delay)
        public search(value: number) {
            this.calls.push([value, now]);
        }
    }

    jest.useFakeTimers();
    const f1 = new Foo();
    const f2 = new Foo();

    let now = 0;
    setInterval(() => now++, 1);

    for (const timeout of [5, 10, 15, 20]) {
        setTimeout(() => f1.search(timeout), timeout);
    }
    for (const timeout of [1, 2, 12]) {
        setTimeout(() => f2.search(timeout), timeout);
    }

    jest.advanceTimersByTime(1000);

    expect(f1.calls).toStrictEqual([[15, 15], [20, 30]]);
    expect(f2.calls).toStrictEqual([[2, 11], [12, 22]]);
    jest.clearAllTimers();
});
