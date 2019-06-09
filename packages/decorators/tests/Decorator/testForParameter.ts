import {Decorator} from "../../src";

// tslint:disable:max-classes-per-file
// tslint:disable:no-empty

const map = new Map();
const decorator = Decorator.forParameter((foo?: string, bar: number = 3) => {
    return (target, key, index) => {
        map.set(target, [target, key, index, foo, bar]);
    };
});

function check(c: any, ...args: any[]) {
    const dArgs = [c.prototype, "foo", 0];
    expect(map.get(c.prototype)).toStrictEqual([...dArgs, ...args]);
}

test("@decorator", () => {
    class User {
        public foo(@decorator foo: number) {}
    }

    check(User, undefined, 3);
});

test("@decorator()", () => {
    class User {
        public foo(@decorator() foo: number) {}
    }

    check(User, undefined, 3);
});

test("@decorator('foo')", () => {
    class User {
        public foo(@decorator("foo") foo: number) {}
    }

    check(User, "foo", 3);
});

test("@decorator('foo', 4)", () => {
    class User {
        public foo(@decorator("foo", 4) foo: number) {}
    }

    check(User, "foo", 4);
});
