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
                type: "NumberNode",
                value: 5
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
    
}); 