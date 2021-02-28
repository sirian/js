// tslint:disable:max-classes-per-file

import {classDecorator} from "../../src";

const map = new Map();
const decorator = classDecorator((foo?: string, bar: number = 3, ...args: any[]) => {
    return (target) => {
        map.set(target, [target, foo, bar, ...args]);
        return target;
    };
});

function check(c: any, ...args: any[]) {
    expect(map.get(c)).toStrictEqual([c, ...args]);
}

test("@decorator", () => {
    @decorator
    class User {
    }

    check(User, undefined, 3);
});

test("@decorator()", () => {
    @decorator()
    class User {
    }

    check(User, undefined, 3);
});

test("@decorator('foo')", () => {
    @decorator("foo")
    class User {
    }

    check(User, "foo", 3);
});

test("@decorator('foo', 4)", () => {
    @decorator("foo", 4)
    class User {
    }

    check(User, "foo", 4);
});

test("@decorator('foo', 4, 3)", () => {
    @decorator("foo", 4, 3)
    class User {
    }

    check(User, "foo", 4, 3);
});
