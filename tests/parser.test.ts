import { Parser } from '../src/parser/parser';
import { Token, TokenType } from '../src/types/tokens';
import { ASTNode, ConstantNode, NumberNode, UnaryOperationNode, VariableNode } from '../src/types/ast';

describe("Parser", () => {
    let parser: Parser;
    
    beforeEach(() => { 
        parser = new Parser();
    });

    it("parses numbers", () => {
        const tokens = [
            { type: TokenType.NUMBER, value: 123 },
            { type: TokenType.EOF }
        ];
        const ast = parser.parse(tokens);
        expect(ast).toEqual({
            type: "NumberNode",
            value: 123
        } as NumberNode);
    });

    it("parses identifiers", () => {
        const tokens = [
            { type: TokenType.VARIABLE, value: "x" },
            { type: TokenType.EOF }
        ]
        const ast = parser.parse(tokens);
        expect(ast).toEqual({
            type: "VariableNode",
            name: "x"
        } as VariableNode);
    }); 

    it("parses PI", () => { 
        const tokens = [
            { type: TokenType.PI },
            { type: TokenType.EOF }
        ];
        const ast = parser.parse(tokens);
        expect(ast).toEqual({
            type: "ConstantNode",
            name: "PI"
        } as ConstantNode);
    });

    it("parses E", () => { 
        const tokens = [
            { type: TokenType.E },
            { type: TokenType.EOF }
        ];
        const ast = parser.parse(tokens);
        expect(ast).toEqual({
            type: "ConstantNode",
            name: "E"
        } as ConstantNode);
    });

    it("parses unary operators", () => {
        const tokens = [
            {type:TokenType.MINUS},
            { type: TokenType.NUMBER, value: 42 },
            { type: TokenType.EOF }
        ];
        const ast = parser.parse(tokens);
        expect(ast).toEqual({
            type: "UnaryOperationNode",
            operator: "MINUS",
            operand: {
                type: "NumberNode",
                value: 42
            }
        } as UnaryOperationNode);
    });

    it("parses binary operations", () => {
        const token = [ 
            { type: TokenType.NUMBER, value: 3 },
            { type: TokenType.PLUS },
            { type: TokenType.NUMBER, value: 5 },
            { type: TokenType.LPAREN},
            { type: TokenType.NUMBER, value: 7 },
            { type: TokenType.PLUS},
            { type: TokenType.NUMBER, value: 2 },
            { type: TokenType.RPAREN},
            { type: TokenType.MINUS},
            { type: TokenType.NUMBER, value: 7 },
            { type: TokenType.DIVIDE},
            { type: TokenType.NUMBER, value: 2 },
            { type: TokenType.MULTIPLY },
            { type: TokenType.NUMBER, value: 4 },
            { type: TokenType.POWER},
            { type: TokenType.NUMBER, value: 2 },
            { type: TokenType.EOF }
        ];
        const ast = parser.parse(token);
        expect(ast).toEqual({
            type: "BinaryOperationNode",
            operator: "PLUS",
            left: { 
                type: "NumberNode",
                value: 3
            },
            right: { 
                type: "BinaryOperationNode",
                operator: "MINUS", 
                left: { 
                    type: "BinaryOperationNode",
                    operator: "MULTIPLY",
                    left: { 
                        type: "NumberNode",
                        value: 5
                    }, 
                    right: { 
                        type: "BinaryOperationNode",
                        operator: "PLUS",
                        left: {
                            type: "NumberNode",
                            value: 7
                        },
                        right: {
                            type: "NumberNode",
                            value: 2
                        }
                    },
                },
                right: { 
                    type: "BinaryOperationNode",
                    operator: "MULTIPLY",
                    left: { 
                        type: "BinaryOperationNode",
                        operator: "DIVIDE",
                        left: { 
                            type: "NumberNode",
                            value: 7
                        },
                        right: { 
                            type: "NumberNode",
                            value: 2
                        }
                    },
                    right: { 
                        type: "BinaryOperationNode",
                        operator: "POWER",
                        left: { 
                            type: "NumberNode",
                            value: 4
                        },
                        right: { 
                            type: "NumberNode",
                            value: 2
                        }
                    }
                },
                
            }

        } as ASTNode);
    });

    it("parses implicit multiplication", () => {
        const tokens = [
            { type: TokenType.VARIABLE, value: "x" },
            { type: TokenType.VARIABLE, value: "y" },
            { type: TokenType.EOF }
        ];

        const ast = parser.parse(tokens);

        expect(ast).toEqual({
            type: "BinaryOperationNode",
            operator: "MULTIPLY",
            left: {
                type: "VariableNode",
                name: "x"
            },
            right: {
                type: "VariableNode",
                name: "y"
            }
        } as ASTNode);
    });

    it("parses nested binary operations", () => {
        const tokens = [
            { type: TokenType.NUMBER, value: 2 },
            { type: TokenType.PLUS },
            { type: TokenType.NUMBER, value: 3 },
            { type: TokenType.MULTIPLY },
            { type: TokenType.NUMBER, value: 4 },
            { type: TokenType.EOF }
        ];
        const ast = parser.parse(tokens);
        expect(ast).toEqual({
            type: "BinaryOperationNode",
            operator: "PLUS",
            left: {
                type: "NumberNode",
                value: 2
            },
            right: {
                type: "BinaryOperationNode",
                operator: "MULTIPLY",
                left: {
                    type: "NumberNode",
                    value: 3
                },
                right: {
                    type: "NumberNode",
                    value: 4
                }
            }
        } as ASTNode);
    });

    it("parses parentheses", () => {
        const tokens = [
            {type: TokenType.NUMBER, value: 2},
            { type: TokenType.LPAREN },
            { type: TokenType.NUMBER, value: 5 },
            { type: TokenType.PLUS },
            { type: TokenType.NUMBER, value: 3 },
            { type: TokenType.RPAREN },
            { type: TokenType.EOF }
        ];
        const ast = parser.parse(tokens);
        expect(ast).toEqual({
            type: "BinaryOperationNode",
            operator: "MULTIPLY",
            left: {
                type: "NumberNode",
                value: 2
            },
            right: {
                type: "BinaryOperationNode",
                operator: "PLUS",
                left: {
                    type: "NumberNode",
                    value: 5
                },
                right: {
                    type: "NumberNode",
                    value: 3
                }
            }
        } as ASTNode);
    });

    it("Parses absolute value", () => {
        const tokens = [
            { type: TokenType.PIPE },
            { type: TokenType.NUMBER, value: -5 },
            { type: TokenType.PIPE },
            { type: TokenType.EOF }
        ];
        const ast = parser.parse(tokens);
        expect(ast).toEqual({
            type: "AbsoluteValueNode",
            value: {
                type: "NumberNode",
                value: -5
            }
        } as ASTNode);
    });


    it("parses functions", () => {
        const tokens = [
            { type: TokenType.FUNCTION, value: "sin" },
            { type: TokenType.LPAREN },
            { type: TokenType.NUMBER, value: 1 },
            { type: TokenType.RPAREN },
            { type: TokenType.EOF }
        ];
        const ast = parser.parse(tokens);
        expect(ast).toEqual({
            type: "FunctionNode",
            name: "sin",
            arguments: [
                {
                    type: "NumberNode",
                    value: 1
                }
            ]
        } as ASTNode);
    });

    it("parses function with multiple arguments", () => {
        const tokens = [
            {type: TokenType.FUNCTION, value: "mod"},
            { type: TokenType.LPAREN },
            { type: TokenType.NUMBER, value: 10 },
            { type: TokenType.COMMA },
            { type: TokenType.NUMBER, value: 3 },
            { type: TokenType.RPAREN },
            { type: TokenType.EOF }
        ];
        const ast = parser.parse(tokens);
        expect(ast).toEqual({
            type: "FunctionNode",
            name: "mod",
            arguments: [
                {
                    type: "NumberNode",
                    value: 10
                },
                {
                    type: "NumberNode",
                    value: 3
                }
            ]
        } as ASTNode);
    });

    it("parses assignment", () => {
        const tokens = [
            { type: TokenType.VARIABLE, value: "x" },
            { type: TokenType.EQUALS },
            { type: TokenType.NUMBER, value: 42 },
            { type: TokenType.EOF }
        ];
        const ast = parser.parse(tokens);
        expect(ast).toEqual({
            type: "AssignmentNode",
            variable: {
                type: "VariableNode",
                name: "x"
            },
            value: {
                type: "NumberNode",
                value: 42
            }
        } as ASTNode);
    });

    it("throws on unexpected tokens", () => {
        const tokens = [
            { type: TokenType.INVALID },
            { type: TokenType.EOF }
        ];
        expect(() => parser.parse(tokens)).toThrow("Unexpected token: INVALID");
    });

    it("throws on missing closure", () => {
        const tokens = [
            { type: TokenType.LPAREN },
            { type: TokenType.NUMBER, value: 5 },
            { type: TokenType.EOF }
        ];
        expect(() => parser.parse(tokens)).toThrow("Expected token type RPAREN, but got EOF at position 2");
    });
});