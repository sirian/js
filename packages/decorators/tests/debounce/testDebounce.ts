import {debounce} from "../../src";

const data: Array<[number[], Array<[number, number]>]> = [
    [[1, 2, 3, 4], [[4, 11]]],
    [[1, 15, 21, 40], [[1, 11], [21, 25], [40, 50]]],
    [[0, 5, 10, 15, 20, 25], [[10, 10], [25, 25]]],
    [[10, 30, 50], [[10, 20], [30, 40], [50, 60]]],
];

test.each(data)("%j %j", (timeouts, expected) => {
    const delay = 10;

    class Foo {
        public calls: Array<[number, number]> = [];

        @debounce(delay)
        public search(value: number) {
            this.calls.push([value, now]);
        }
    }

    jest.useFakeTimers();
    const f = new Foo();

    let now = 0;
    setInterval(() => now++, 1);

    for (const timeout of timeouts) {
        setTimeout(() => f.search(timeout), timeout);
    }

    jest.advanceTimersByTime(1000);

    expect(f.calls).toEqual(expected);
});
