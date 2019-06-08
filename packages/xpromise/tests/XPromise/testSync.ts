import {XPromise} from "../../src";

test("Test sync", async () => {
    const order: any[] = [];
    const promise = XPromise.create<any>();
    order.push("foo");
    promise.then((v) => order.push(["t1", v]) && -v).then((v) => order.push(["t2", v]));
    order.push("bar");
    promise.then((v) => order.push(["t3", v]));
    order.push("baz");
    promise.resolve(3);
    order.push("zoo");

    await promise;

    expect(order).toEqual(["foo", "bar", "baz", ["t1", 3], ["t2", -3], ["t3", 3], "zoo"]);
    // expect(order).toEqual(["foo", "bar", "baz", "zoo", ["t1", 3], ["t3", 3], ["t2", -3]]);
});
