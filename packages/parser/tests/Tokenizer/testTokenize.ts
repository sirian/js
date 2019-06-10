import {LexerTokenizer, RegExpLexer, Token} from "../../src";

const enum TToken {
    WHITESPACE,
    NUMBER,
}

const ws = (value: string, pos: number) => new Token(TToken.WHITESPACE, value, pos);
const num = (value: string, pos: number) => new Token(TToken.NUMBER, value, pos);

const data: Array<[string, Token[]]> = [
    ["", []],
    ["42", [num("42", 0)]],
    ["42 24", [num("42", 0), ws(" ", 2), num("24", 3)]],
    ["42  \t 24", [num("42", 0), ws("  \t ", 2), num("24", 6)]],

];

test.each(data)("tokenize(%o) === %o", (line, expected) => {
    const tokenizer = new LexerTokenizer({
        lexers: [
            new RegExpLexer(/^\s+/, TToken.WHITESPACE),
            new RegExpLexer(/^\d+/, TToken.NUMBER),
        ],
    });

    const tokens = tokenizer.tokenize(line).getTokens();
    expect(tokens).toStrictEqual(expected);
});
