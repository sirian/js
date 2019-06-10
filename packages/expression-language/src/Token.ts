export enum TokenType {
    EOF = "eof",
    NAME = "name",
    NUMBER = "number",
    STRING = "string",
    OPERATOR = "operator",
    PUNCTUATION = "punctuation",
}

export type TokenTypes = {
    [TokenType.EOF]: any;
    [TokenType.NAME]: string;
    [TokenType.NUMBER]: number;
    [TokenType.STRING]: string;
    [TokenType.OPERATOR]: string;
    [TokenType.PUNCTUATION]: string;
};
