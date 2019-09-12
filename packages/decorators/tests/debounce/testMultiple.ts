import {debounce} from "../../src";

test("@debounce multiple", () => {
    class Foo {
        public calls: Array<[number, number]> = [];

        @debounce(5)
        @debounce(3)
        public search(value: number) {
            this.calls.push([value, now]);
        }
    }

    jest.useFakeTimers();
    const f = new Foo();

    let now = 0;
    setInterval(() => now++, 1);

    for (let timeout = 1; timeout < 20; timeout ++) {
        setTimeout(() => f.search(timeout), timeout);
    }

    jest.advanceTimersByTime(1000);

    expect(f.calls).toEqual([
        [6, 9],
        [12, 15],
        [18, 21],
        [19, 27],
    ]);
});

test("@debounce multiple", () => {
    class Foo {
        public calls: Array<[number, number]> = [];

        @debounce(3)
        @debounce(5)
        public search(value: number) {
            this.calls.push([value, now]);
        }
    }

    jest.useFakeTimers();
    const f = new Foo();

    let now = 0;
    setInterval(() => now++, 1);

    for (let timeout = 1; timeout < 20; timeout ++) {
        setTimeout(() => f.search(timeout), timeout);
    }

    jest.advanceTimersByTime(1000);

    expect(f.calls).toEqual([
        [8, 9],
        [16, 17],
        [19, 25],
    ]);
});
