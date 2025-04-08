import { Token, TokenType } from "../types/tokens";

const FUNCTIONS = ["sin", "cos", "tan", "log", "sqrt", "nthroot"];

export class Lexer {
    private pos = 0;
    private currentChar = null as string | null;
    private input: string = "";

    private advance() {
        this.pos++;
        this.currentChar =
            this.pos < this.input.length ? this.input[this.pos] : null;
    }

    private peek(): string | null {
        return this.pos + 1 < this.input.length
            ? this.input[this.pos + 1]
            : null;
    }

    private skipWhitespace() {
        while (this.currentChar !== null && /\s/.test(this.currentChar)) {
            this.advance();
        }
    }

    private number(): Token {
        let result = "";
        while (this.currentChar !== null && /[0-9.]/.test(this.currentChar)) {
            result += this.currentChar;
            this.advance();
        }
        return {
            type: TokenType.NUMBER,
            value: parseFloat(result),
        };
    }

    private identifier(): Token[] {
        let result = "";
        while (this.currentChar !== null && /[a-zA-Z]/.test(this.currentChar)) {
            result += this.currentChar;
            this.advance();
        }

        if (result === "pi") return [{ type: TokenType.PI }];
        if (result === "e") return [{ type: TokenType.E }];
        if (FUNCTIONS.includes(result))
            return [{ type: TokenType.FUNCTION, value: result }];

        // If not a constant or function, split into individual characters
        return result
            .split("")
            .map((char) => ({ type: TokenType.VARIABLE, value: char }));
    }

    private getNextToken(): Token {
        while (this.currentChar !== null) {
            if (/\s/.test(this.currentChar)) {
                this.skipWhitespace();
                continue;
            }

            if (/[0-9.]/.test(this.currentChar)) {
                return this.number();
            }

            if (/[a-zA-Z]/.test(this.currentChar)) {
                const tokens = this.identifier();
                if (tokens.length > 1) {
                    // Push all tokens except the first back into the input stream
                    this.input =
                        tokens
                            .slice(1)
                            .map((t) => t.value)
                            .join("") + this.input.slice(this.pos);
                    this.pos = 0;
                    this.currentChar = this.input[0];
                }
                return tokens[0];
            }

            switch (this.currentChar) {
                case "+":
                    this.advance();
                    return { type: TokenType.PLUS };
                case "-":
                    this.advance();
                    return { type: TokenType.MINUS };
                case "*":
                    this.advance();
                    return { type: TokenType.MULTIPLY };
                case "/":
                    this.advance();
                    return { type: TokenType.DIVIDE };
                case "^":
                    this.advance();
                    return { type: TokenType.POWER };
                case "(":
                    this.advance();
                    return { type: TokenType.LPAREN };
                case ")":
                    this.advance();
                    return { type: TokenType.RPAREN };
                case ",":
                    this.advance();
                    return { type: TokenType.COMMA };
                case "|":
                    this.advance();
                    return { type: TokenType.PIPE };
                case "=":
                    this.advance();
                    return { type: TokenType.EQUALS };
                default:
                    const invalidChar = this.currentChar;
                    this.advance();
                    return { type: TokenType.INVALID, value: invalidChar };
            }
        }

        return { type: TokenType.EOF };
    }

    public tokenize(input: string): Token[] {
        const tokens: Token[] = [];
        let token: Token;

        // Reset lexer state
        this.pos = 0;
        this.input = input;
        this.currentChar = this.input.length > 0 ? this.input[0] : null;

        // Tokenize the input until EOF
        do {
            token = this.getNextToken();
            tokens.push(token);
        } while (token.type !== TokenType.EOF);

        return tokens;
    }
}
