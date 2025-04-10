import { Lexer } from "../src/lexer/lexer";
import { TokenType } from "../src/types/tokens";

describe("Lexer", () => {
    let lexer: Lexer;

    beforeEach(() => {
        lexer = new Lexer();
    });

    it("should tokenize numbers", () => {
        const tokens = lexer.tokenize("123 45.67");
        expect(tokens).toEqual([
            { type: TokenType.NUMBER, value: 123 },
            { type: TokenType.NUMBER, value: 45.67 },
            { type: TokenType.EOF }
        ]);
    });

    it("should tokenize operators", () => {
        const tokens = lexer.tokenize("+ - * / ^ | =");
        expect(tokens).toEqual([
            { type: TokenType.PLUS },
            { type: TokenType.MINUS },
            { type: TokenType.MULTIPLY },
            { type: TokenType.DIVIDE },
            { type: TokenType.POWER },
            { type: TokenType.PIPE},
            { type: TokenType.EQUALS },
            { type: TokenType.EOF }
        ]);
    });

    it("should tokenize parentheses and commas", () => {
        const tokens = lexer.tokenize("( ) ,");
        expect(tokens).toEqual([
            { type: TokenType.LPAREN },
            { type: TokenType.RPAREN },
            { type: TokenType.COMMA },
            { type: TokenType.EOF }
        ]);
    });

    it("should tokenize constants", () => {
        const tokens = lexer.tokenize("pi e");
        expect(tokens).toEqual([
            { type: TokenType.PI },
            { type: TokenType.E },
            { type: TokenType.EOF }
        ]);
    });
    it("should tokenize variables", () => {
        const tokens = lexer.tokenize("xyz");
        expect(tokens).toEqual([
            { type: TokenType.VARIABLE, value: "x" },
            { type: TokenType.VARIABLE, value: "y" },
            { type: TokenType.VARIABLE, value: "z" },
            { type: TokenType.EOF }
        ]);
    });

    it("should tokenize built-in functions", () => {
        const tokens = lexer.tokenize("sin cos tan");
        expect(tokens).toEqual([
            { type: TokenType.FUNCTION, value: "sin" },
            { type: TokenType.FUNCTION, value: "cos" },
            { type: TokenType.FUNCTION, value: "tan" },
            { type: TokenType.EOF }
        ]);
    });

    it("should handle invalid characters", () => {
        expect(() => lexer.tokenize("@")).toThrow("Invalid character: @");
    });

    it("should handle mixed input", () => {
        const tokens = lexer.tokenize("3 + 4 * x - sin(pi)");
        expect(tokens).toEqual([
            { type: TokenType.NUMBER, value: 3 },
            { type: TokenType.PLUS },
            { type: TokenType.NUMBER, value: 4 },
            { type: TokenType.MULTIPLY },
            { type: TokenType.VARIABLE, value: "x" },
            { type: TokenType.MINUS },
            { type: TokenType.FUNCTION, value: "sin" },
            { type: TokenType.LPAREN },
            { type: TokenType.PI },
            { type: TokenType.RPAREN },
            { type: TokenType.EOF }
        ]);
    });

    it("should handle empty input", () => {
        const tokens = lexer.tokenize("");
        expect(tokens).toEqual([
            { type: TokenType.EOF }
        ]);
    });
});
