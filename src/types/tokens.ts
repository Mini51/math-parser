// types for a math expression tokenizer

export enum TokenType {
    PLUS = "PLUS", // +
    MINUS = "MINUS", // -
    MULTIPLY = "MULTIPLY", // *
    DIVIDE = "DIVIDE", // /
    POWER = "POWER", // ^
    NUMBER = "NUMBER", // 123.45
    VARIABLE = "VARIABLE", // x, y, z, etc.
    PI = "PI", // π (pi constant)
    E = "E", // e (Euler's number)
    LPAREN = "LPAREN", // (
    RPAREN = "RPAREN", // )
    COMMA = "COMMA", // ,
    EQUALS = "EQUALS", // = (for assignment or equality check)
    FUNCTION = "FUNCTION", // sin(), cos(), tan(), log(), sqrt(), etc.
    PIPE = "PIPE", // | (for absolute value or norm)
    EOF = "EOF", // End of file/input
    INVALID = "INVALID", // Invalid token
}

export interface Token {
    type: TokenType;
    value?: string | number; // optional value for NUMBER or VARIABLE tokens
}
