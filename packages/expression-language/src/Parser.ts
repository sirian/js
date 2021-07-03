import {valuesOf} from "@sirian/common";
import {SyntaxError} from "@sirian/parser";
import {
    AccessNode,
    AccessType,
    ArgumentsNode,
    ArrayNode,
    BinaryNode,
    ConditionalNode,
    ConstantNode,
    FunctionNode,
    HashNode,
    NameNode,
    Node,
    UnaryNode,
} from "./nodes";
import {OperatorType} from "./Operator";
import {Operators} from "./Operators";
import {TokenType} from "./Token";
import {TokenStream} from "./TokenStream";

export interface ParseOptions {
    names: string[];
    functions: string[];
}

export interface ParserInit {
    operators: Operators;
}

export class Parser {
    protected options!: ParseOptions;
    protected stream!: TokenStream;
    protected operators: Operators;

    constructor(init: Partial<ParserInit> = {}) {
        this.operators = init.operators || Operators.default;
    }

    public parse(stream: TokenStream, options: Partial<ParseOptions> = {}) {
        this.stream = stream;
        this.options = {
            names: [],
            functions: [],
            ...options,
        };

        const node = this.parseExpression();

        if (!stream.isEOF()) {
            const current = stream.current;
            if (!current.is(TokenType.EOF)) {
                const {type, value, position} = current;
                throw new SyntaxError(`Unexpected token "${type}" of value "${value}"`, position);
            }
        }
        return node;
    }

    protected parseExpression(precedence = 0) {
        let expr = this.getPrimary();

        const stream = this.stream;
        let token = stream.current;

        const operators = this.operators;

        while (token.is(TokenType.OPERATOR)) {
            const operator = token.value;

            if (!operators.hasBinary(operator)) {
                break;
            }

            const op = operators.binary[operator];
            const opPrecedence = op.precedence;
            if (opPrecedence < precedence) {
                break;
            }

            stream.next();

            const right = this.parseExpression(OperatorType.LEFT === op.type ? opPrecedence + 1 : opPrecedence);
            expr = new BinaryNode({left: expr, right}, {operator});

            token = stream.current;
        }

        if (0 === precedence) {
            return this.parseConditionalExpression(expr);
        }

        return expr;
    }

    protected parsePrimaryExpression() {
        const {stream, options} = this;
        const token = stream.current;

        let node;
        const {position, value, type} = token;
        const source = stream.source;
        switch (type) {
            case TokenType.NAME:
                stream.next();
                switch (value) {
                    case "true":
                    case "TRUE":
                        return new ConstantNode(true);

                    case "false":
                    case "FALSE":
                        return new ConstantNode(false);

                    case "null":
                    case "NULL":
                        // eslint-disable-next-line unicorn/no-null
                        return new ConstantNode(null);

                    default:
                        if ("(" === stream.current.value) {
                            const functions = options.functions;
                            if (-1 === functions.indexOf(value)) {
                                const message = `The function "${value}" does not exist`;
                                throw new SyntaxError(message, position, source, value, functions);
                            }

                            node = new FunctionNode(value, this.parseArguments());
                        } else {
                            const names = options.names;
                            if (-1 === names.indexOf(value)) {
                                const message = `Variable "${value}" is not valid`;
                                throw new SyntaxError(message, position, source, value, names);
                            }

                            node = new NameNode(value);
                        }
                }
                break;

            case TokenType.NUMBER:
            case TokenType.STRING:
                stream.next();
                return new ConstantNode(value);

            default:
                if (token.test(TokenType.PUNCTUATION, "[")) {
                    node = this.parseArrayExpression();
                } else if (token.test(TokenType.PUNCTUATION, "{")) {
                    node = this.parseHashExpression();
                } else {
                    throw new SyntaxError(`Unexpected token "${type}" of value "${value}"`, position, source);
                }
        }

        return this.parsePostfixExpression(node);
    }

    protected parseArrayExpression() {
        const stream = this.stream;
        stream.expect(TokenType.PUNCTUATION, "[", "An array element was expected");

        const node = new ArrayNode();
        let first = true;
        while (!stream.current.test(TokenType.PUNCTUATION, "]")) {
            if (!first) {
                stream.expect(TokenType.PUNCTUATION, ",", "An array element must be followed by a comma");

                // trailing ,?
                if (stream.current.test(TokenType.PUNCTUATION, "]")) {
                    break;
                }
            }
            first = false;

            node.addElement(this.parseExpression());
        }
        stream.expect(TokenType.PUNCTUATION, "]", "An opened array is not properly closed");

        return node;
    }

    protected parseHashExpression() {
        const stream = this.stream;
        stream.expect(TokenType.PUNCTUATION, "{", "A hash element was expected");

        const node = new HashNode();
        let first = true;

        // eslint-disable-next-line no-constant-condition
        while (true) {
            if (stream.current.test(TokenType.PUNCTUATION, "}")) {
                break;
            }

            if (!first) {
                stream.expect(TokenType.PUNCTUATION, ",", "A hash value must be followed by a comma");

                // trailing ,?
                if (stream.current.test(TokenType.PUNCTUATION, "}")) {
                    break;
                }
            }
            first = false;

            let key;

            // a hash key can be:
            //
            //  * a number -- 12
            //  * a string -- 'a'
            //  * a name, which is equivalent to a string -- a
            //  * an expression, which must be enclosed in parentheses -- (1 + 2)

            const current = stream.current;

            if (current.is(TokenType.STRING, TokenType.NAME, TokenType.NUMBER)) {
                key = new ConstantNode(current.value);
                stream.next();
            } else if (current.test(TokenType.PUNCTUATION, "(")) {
                key = this.parseExpression();
            } else {
                const message = `A hash key must be a quoted string, a number, a name,` +
                    ` or an expression enclosed in parentheses` +
                    ` (unexpected token "${current.type}" of value "${current.value}"`;

                throw new SyntaxError(message, current.position, stream.source);
            }

            stream.expect(TokenType.PUNCTUATION, ":", "A hash key must be followed by a colon (:)");
            const valueExpr = this.parseExpression();

            node.addElement(key, valueExpr);
        }
        stream.expect(TokenType.PUNCTUATION, "}", "An opened hash is not properly closed");

        return node;
    }

    protected parsePostfixExpression(node: Node) {
        const stream = this.stream;

        // eslint-disable-next-line no-constant-condition
        while (true) {
            const token = stream.current;

            if (!token.is(TokenType.PUNCTUATION)) {
                break;
            }

            const value = token.value;

            if ("." === value) {
                node = this.parsePropertyAccess(node);
            } else if ("[" === value) {
                node = this.parseArrayAccess(node);
            } else {
                break;
            }
        }

        return node;
    }

    protected parseArguments() {
        const args: Node[] = [];
        const stream = this.stream;
        stream.expect(TokenType.PUNCTUATION, "(", "A list of arguments must begin with an opening parenthesis");
        while (!stream.current.test(TokenType.PUNCTUATION, ")")) {
            if (args.length) {
                stream.expect(TokenType.PUNCTUATION, ",", "Arguments must be separated by a comma");
            }

            args.push(this.parseExpression());
        }
        stream.expect(TokenType.PUNCTUATION, ")", "A list of arguments must be closed by a parenthesis");

        const nodes: Record<number, Node> = {...args};

        return new Node(nodes, {});
    }

    protected parseArrayAccess(node: Node) {
        const stream = this.stream;
        stream.next();
        const key = this.parseExpression();
        stream.expect(TokenType.PUNCTUATION, "]");
        const args = new ArgumentsNode();

        return new AccessNode({node, key, args}, {type: AccessType.ARRAY});
    }

    protected parsePropertyAccess(node: Node) {
        const stream = this.stream;
        stream.next();
        const token = stream.current;
        stream.next();

        // Operators like "not" and "matches" are valid method or property names,
        //
        // In other words, besides NAME_TYPE, OPERATOR_TYPE could also be parsed as a property or method.
        // This is because operatorAlias are processed by the lexer prior to names.
        // So "not" in "foo.not()" or "matches" in "foo.matches" will be recognized as an operator first.
        // But in fact, "not" and "matches" in such expressions shall be parsed as method or property names.
        //
        // And this ONLY works if the operator consists of valid characters for a property or method name.
        //
        // Other types, such as STRING_TYPE and NUMBER_TYPE, can't be parsed as property nor method names.
        //
        // As a result, if token is NOT an operator OR token.value is NOT a valid property or method name,
        // an exception shall be thrown.

        if (!token.is(TokenType.NAME) && (!token.is(TokenType.OPERATOR) || !/^[A-Z_a-z\u007F-\u00FF][\w\u007F-\u00FF]*/.test(token.value))) {
            throw new SyntaxError("Expected name", token.position, stream.source);
        }

        const key = new ConstantNode(token.value, true);

        const args = new ArgumentsNode();
        let type;
        if (stream.current.test(TokenType.PUNCTUATION, "(")) {
            type = AccessType.METHOD;
            const argNodes = this.parseArguments().nodes;
            for (const n of valuesOf(argNodes)) {
                args.addElement(n);
            }
        } else {
            type = AccessType.PROPERTY;
        }

        return new AccessNode({node, key, args}, {type});
    }

    protected getPrimary(): Node {
        const stream = this.stream;
        const token = stream.current;

        const operators = this.operators;
        const value = token.value;

        if (token.is(TokenType.OPERATOR) && operators.hasUnary(value)) {
            const operator = operators.unary[value];
            stream.next();
            const expr = this.parseExpression(operator.precedence);

            return this.parsePostfixExpression(new UnaryNode(value, expr));
        }

        if (token.test(TokenType.PUNCTUATION, "(")) {
            stream.next();
            const expr = this.parseExpression();
            stream.expect(TokenType.PUNCTUATION, ")", "An opened parenthesis is not properly closed");

            return this.parsePostfixExpression(expr);
        }

        return this.parsePrimaryExpression();
    }

    protected parseConditionalExpression(expr1: Node) {
        let expr2;
        let expr3;

        const stream = this.stream;

        while (stream.current.test(TokenType.PUNCTUATION, "?")) {
            stream.next();

            if (stream.current.test(TokenType.PUNCTUATION, ":")) {
                stream.next();
                expr2 = expr1;
                expr3 = this.parseExpression();
            } else {
                expr2 = this.parseExpression();

                if (stream.current.test(TokenType.PUNCTUATION, ":")) {
                    stream.next();
                    expr3 = this.parseExpression();
                } else {
                    // eslint-disable-next-line unicorn/no-null
                    expr3 = new ConstantNode(null);
                }
            }

            expr1 = new ConditionalNode({expr1, expr2, expr3}, {});
        }

        return expr1;
    }
}
