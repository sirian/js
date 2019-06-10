import {Token, TokenStream} from "../../src";

const t = () => new Token(0, Math.random().toString(16), 0);

test("testPush", () => {
    const stream = new TokenStream();

    const t1 = t();
    const t2 = t();
    const t3 = t();

    expect(stream.getTokens()).toStrictEqual([]);
    expect(stream.length).toBe(0);

    stream.push(t1);
    expect(stream.getTokens()).toStrictEqual([t1]);
    expect(stream.length).toBe(1);

    stream.push(t2);
    expect(stream.getTokens()).toStrictEqual([t1, t2]);
    expect(stream.length).toBe(2);

    stream.push(t3);
    expect(stream.getTokens()).toStrictEqual([t1, t2, t3]);
    expect(stream.length).toBe(3);
});
