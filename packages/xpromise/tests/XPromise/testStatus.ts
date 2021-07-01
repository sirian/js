import {XPromise} from "../../src";

test("Test status", () => {
    const p = XPromise.create();
    expect(p.isPending()).toBe(true);
    expect(p.isFulfilled()).toBe(false);
    expect(p.isRejected()).toBe(false);

    p.resolve(1);
    expect(p.isPending()).toBe(false);
    expect(p.isFulfilled()).toBe(true);
    expect(p.isRejected()).toBe(false);
});

test("Test status XPromise.resolve()", () => {
    const p = XPromise.resolve(1);
    expect(p.isPending()).toBe(false);
    expect(p.isFulfilled()).toBe(true);
    expect(p.isRejected()).toBe(false);
});

test("Test status XPromise.reject()", () => {
    const p = XPromise.reject(1);
    expect(p.isPending()).toBe(false);
    expect(p.isFulfilled()).toBe(false);
    expect(p.isRejected()).toBe(true);
});
