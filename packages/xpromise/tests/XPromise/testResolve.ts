import {XPromise} from "../../src";

test(".resolve(1) resolves to 1", async () => {
    const p = XPromise.resolve(1);
    await expect(p).resolves.toBe(1);
});

test(".resolve(Promise.resolve(1)) resolves to 1", async () => {
    const p = XPromise.resolve(Promise.resolve(1));
    await expect(p).resolves.toBe(1);
});

test(".resolve(Promise.resolve(1)).then(x); x should be 1", async () => {
    const p = XPromise
        .resolve(Promise.resolve(1))
        .then((x) => {
            expect(x).toBe(1);
            return 2;
        });

    await expect(p).resolves.toBe(2);
});

test(".resolve() twice", async () => {
    const p = new XPromise();
    p.resolve(1);
    p.resolve(2);
    await expect(p).resolves.toBe(1);
    await expect(p.then(() => 3)).resolves.toBe(3);
});

test(".reject() twice", async () => {
    const p = new XPromise();
    p.reject(1);
    p.reject(2);
    await expect(p).rejects.toBe(1);
    await expect(p.catch(() => 3)).resolves.toBe(3);
});

test("resolve with rejected XPromise", () => {
    const rej = XPromise.reject();
    const p = XPromise.resolve(rej);

    expect(p.isRejected()).toBe(true);
});

test("resolve with inherited class", () => {
    class FooPromise extends XPromise {}

    const foo = new FooPromise();
    const xpromise = new XPromise();

    expect(XPromise.resolve(xpromise)).toBe(xpromise);
    expect(XPromise.resolve(foo)).toBe(foo);
    expect(FooPromise.resolve(foo)).toBe(foo);
    expect(FooPromise.resolve(xpromise)).not.toBe(xpromise);
    expect(FooPromise.resolve(xpromise)).toBeInstanceOf(FooPromise);
});

test(".resolve(pending) and then .reject()", () => {
    const pendingPromise = new XPromise();
    const promise = new XPromise((resolve) => resolve(pendingPromise));

    expect(promise.isPending()).toBe(true);
    expect(promise.isFulfilled()).toBe(false);
    expect(promise.isRejected()).toBe(false);
    expect(promise.isSettled()).toBe(false);

    // reject should be ignored because promise was resolved with pendingPromise
    promise.reject();
    expect(promise.isPending()).toBe(true);
    expect(promise.isFulfilled()).toBe(false);
    expect(promise.isRejected()).toBe(false);
    expect(promise.isSettled()).toBe(false);

    // now promise will be settled
    pendingPromise.resolve();
    expect(promise.isPending()).toBe(false);
    expect(promise.isFulfilled()).toBe(true);
    expect(promise.isRejected()).toBe(false);
    expect(promise.isSettled()).toBe(true);
});
