import { Parser } from '../src/parser/parser';
import { Token, TokenType } from '../src/types/tokens';
import { ASTNode, NumberNode } from '../src/types/ast';
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
        } as ASTNode);
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
        } as ASTNode);
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
        } as ASTNode);
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
        } as ASTNode);
    });

}); 