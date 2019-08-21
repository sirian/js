import {debounce} from "../../src";

const data = [
    [[1, 2, 3, 4], [4]],
    [[1, 15, 21, 40], [1, 21, 40]],
    [[0, 5, 10, 15, 20, 25], [25]],
    [[10, 30, 50], [10, 30, 50]],
];

test.each(data)("%j %j", (timeouts: number[], expected: number[]) => {
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

    expect(f.calls).toEqual(expected.map((value) => [value, value + delay]));
});
