import { Token, TokenType } from "../types/tokens";
import {
    ASTNode,
    NumberNode,
    VariableNode,
    BinaryOperationNode,
    FunctionNode,
    AssignmentNode,
    AbsoluteValueNode,
    ConstantNode,
    UnaryOperationNode,
} from "../types/ast";

export class Parser {
    private tokens: Token[] = [];
    private pos = 0;

    private get current(): Token {
        return this.tokens[this.pos];
    }

    private advance(): void {
        if (this.pos < this.tokens.length - 1) this.pos++;
    }

    private expect(type: TokenType): Token {
        const token = this.current;
        if (token.type !== type) {
            throw new Error(
                `Expected token type ${type}, but got ${token.type} at position ${this.pos}`
            );
        }
        this.advance();
        return token;
    }

    public parse(tokens: Token[]): ASTNode | null {
        this.tokens = tokens;
        this.pos = 0;

        if (
            this.current.type === TokenType.VARIABLE &&
            this.tokens[this.pos + 1]?.type === TokenType.EQUALS
        ) {
            return this.parseAssignment();
        }

        return this.parseExpression();
    }

    private parseExpression(precedence = 0): ASTNode {
        let left: ASTNode;

        // Handle unary operators (e.g., -1) at the start of an expression
        if (this.isUnaryOperator(this.current.type)) {
            const op = this.current;
            this.advance();
            const operand = this.parseExpression(this.getPrecedence(op.type));
            left = {
                type: "UnaryOperationNode",
                operator: op.type,
                operand,
            } as UnaryOperationNode;
        } else {
            left = this.parsePrimary();
        }

        return this.parseBinaryOperations(left, precedence);
    }

    private parseBinaryOperations(left: ASTNode, precedence: number): ASTNode {
        while (true) {
            let op: Token | null = null;
            let opPrecedence: number;

            if (this.isBinaryOperator(this.current.type)) {
                op = this.current;
                opPrecedence = this.getPrecedence(op.type);
                if (opPrecedence < precedence) break;
                this.advance();
            } else if (this.isImplicitMultiplication()) {
                op = { type: TokenType.MULTIPLY, value: "*" } as Token;
                opPrecedence = this.getPrecedence(TokenType.MULTIPLY);
            } else {
                break;
            }

            const right = this.parseExpression(opPrecedence);
            left = {
                type: "BinaryOperationNode",
                operator: op.type,
                left,
                right,
            } as BinaryOperationNode;
        }

        return left;
    }

    private parsePrimary(): ASTNode {
        let node: ASTNode;

        const token = this.current;
        switch (token.type) {
            case TokenType.NUMBER:
                node = this.parseNumber();
                break;
            case TokenType.VARIABLE:
                node = this.parseVariable();
                break;
            case TokenType.PI:
            case TokenType.E:
                node = this.parseConstant();
                break;
            case TokenType.LPAREN:
                this.advance();
                node = this.parseExpression();
                this.expect(TokenType.RPAREN);
                break;
            case TokenType.FUNCTION:
                node = this.parseFunction();
                break;
            case TokenType.PIPE:
                node = this.parseAbsoluteValue();
                break;
            default:
                throw new Error(`Unexpected token: ${token.type}`);
        }

        // Support implicit multiplication chaining: e.g., aaaa, 2x, (x+1)(x-1)
        while (this.isMultipliable(this.current)) {
            const right = this.parsePrimary();
            node = {
                type: "BinaryOperationNode",
                operator: TokenType.MULTIPLY,
                left: node,
                right,
            } as BinaryOperationNode;
        }

        return node;
    }

    private parseNumber(): NumberNode {
        const token = this.current;
        this.advance();
        return {
            type: "NumberNode",
            value: parseFloat(token.value as string),
        };
    }

    private parseVariable(): VariableNode {
        const token = this.current;
        this.advance();
        return {
            type: "VariableNode",
            name: token.value as string,
        };
    }

    private parseFunction(): FunctionNode {
        const token = this.current;
        this.advance();
        this.expect(TokenType.LPAREN);
        const args: ASTNode[] = [];

        if (this.current.type !== TokenType.RPAREN) {
            do {
                args.push(this.parseExpression());
                if (this.current.type === TokenType.COMMA) {
                    this.advance();
                } else {
                    break;
                }
            } while (true);
        }

        this.expect(TokenType.RPAREN);
        return {
            type: "FunctionNode",
            name: token.value as string,
            arguments: args,
        };
    }

    private parseConstant(): ConstantNode {
        const token = this.current;
        this.advance();
        return {
            type: "ConstantNode",
            name: token.type === TokenType.PI ? "PI" : "E",
        };
    }

    private parseAbsoluteValue(): AbsoluteValueNode {
        this.advance();
        const value = this.parseExpression();
        this.expect(TokenType.PIPE);
        return {
            type: "AbsoluteValueNode",
            value,
        };
    }

    private parseAssignment(): AssignmentNode {
        const variable = this.parseVariable();
        this.expect(TokenType.EQUALS);
        const value = this.parseExpression();
        return {
            type: "AssignmentNode",
            variable,
            value,
        };
    }

    private isBinaryOperator(type: TokenType): boolean {
        return [
            TokenType.PLUS,
            TokenType.MINUS,
            TokenType.MULTIPLY,
            TokenType.DIVIDE,
            TokenType.POWER,
        ].includes(type);
    }

    private getPrecedence(type: TokenType): number {
        switch (type) {
            case TokenType.PLUS:
            case TokenType.MINUS:
                return 1;
            case TokenType.MULTIPLY:
            case TokenType.DIVIDE:
                return 2;
            case TokenType.POWER:
                return 3;
            default:
                return 0;
        }
    }

    private isImplicitMultiplication(): boolean {
        const current = this.current;
        const next = this.tokens[this.pos + 1];

        return (
            (current.type === TokenType.NUMBER && this.isMultipliable(next)) ||
            (current.type === TokenType.RPAREN && this.isMultipliable(next)) ||
            (current.type === TokenType.VARIABLE &&
                this.isMultipliable(next)) ||
            (current.type === TokenType.PI && this.isMultipliable(next)) ||
            (current.type === TokenType.E && this.isMultipliable(next)) ||
            (current.type === TokenType.FUNCTION &&
                next?.type !== TokenType.RPAREN) // e.g., sin(2x)
        );
    }

    private isMultipliable(token?: Token): boolean {
        return (
            !!token &&
            (token.type === TokenType.VARIABLE ||
                token.type === TokenType.PI ||
                token.type === TokenType.E ||
                token.type === TokenType.LPAREN ||
                token.type === TokenType.NUMBER ||
                token.type === TokenType.FUNCTION ||
                token.type === TokenType.PIPE)
        );
    }

    private isUnaryOperator(type: TokenType): boolean {
        return type === TokenType.MINUS;
    }
}
