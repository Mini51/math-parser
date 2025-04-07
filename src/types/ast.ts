// PLUS = "PLUS",          // +
// MINUS = "MINUS",        // -
// MULTIPLY = "MULTIPLY",  // *
// DIVIDE = "DIVIDE",      // /
// POWER = "POWER",        // ^
// NUMBER = "NUMBER",      // 123.45
// VARIABLE = "VARIABLE",  // x, y, z, etc.
// PI = "PI",              // π (pi constant)
// E = "E",                // e (Euler's number)
// LPAREN = "LPAREN",      // (
// RPAREN = "RPAREN",      // )
// COMMA = "COMMA",        // ,
// EQUALS = "EQUALS",      // = (for assignment or equality check)
// FUNCTION = "FUNCTION",  // sin(), cos(), tan(), log(), sqrt(), etc.
// PIPE = "PIPE",          // | (for absolute value or norm)
// EOF = "EOF",            // End of file/input
// INVALID = "INVALID"     // Invalid token

export interface ASTNode {
    type: string;
}

export interface NumberNode extends ASTNode {
    type: "NumberNode";
    value: number;
}

export interface VariableNode extends ASTNode {
    type: "VariableNode";
    name: string;
}

export interface BinaryOperationNode extends ASTNode {
    type: "BinaryOperationNode";
    operator: string; // e.g., "+", "-", "*", "/", "^"
    left: ASTNode;
    right: ASTNode;
}

export interface UnaryOperationNode extends ASTNode {
    type: "UnaryOperationNode";
    operator: string; // e.g., "+", "-"
    operand: ASTNode;
}


export interface FunctionNode extends ASTNode {
    type: "FunctionNode";
    name: string; // e.g., "sin", "cos", "log"
    arguments: ASTNode[]; // Function arguments
}

export interface AssignmentNode extends ASTNode {
    type: "AssignmentNode";
    variable: VariableNode;
    value: ASTNode;
}

export interface AbsoluteValueNode extends ASTNode {
    type: "AbsoluteValueNode";
    value: ASTNode;
}

export interface ConstantNode extends ASTNode {
    type: "ConstantNode";
    name: "PI" | "E"; // Specific constants
}

export interface ParenthesisNode extends ASTNode {
    type: "ParenthesisNode";
    content: ASTNode; // Content inside parentheses
}

export interface CommaNode extends ASTNode {
    type: "CommaNode";
}
