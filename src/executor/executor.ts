import { Token, TokenType } from "../types/tokens";
import {
    ASTNode,
    NumberNode,
    VariableNode,
    BinaryOperationNode,
    UnaryOperationNode,
    FunctionNode,
    AssignmentNode,
    AbsoluteValueNode,
    ConstantNode,
} from "../types/ast";
import { builtInFunctions } from "../helpers/builtIn";
export class Executor {
    private variables: { [key: string]: number } = {};
    public execute(node: ASTNode): number | null {
        switch (node.type) {
            case "NumberNode":
                return (node as NumberNode).value;
            case "VariableNode":
                return this.variables[(node as VariableNode).name] || 0;
            case "BinaryOperationNode":
                return this.evaluateBinaryOperation(
                    node as BinaryOperationNode
                );
            case "UnaryOperationNode":
                return this.evaluateUnaryOperation(node as UnaryOperationNode);
            case "FunctionNode":
                return this.evaluateFunction(node as FunctionNode);
            case "AssignmentNode":
                return this.executeAssignment(node as AssignmentNode);
            case "AbsoluteValueNode":
                return Math.abs(
                    this.execute((node as AbsoluteValueNode).value) || 0
                );
            case "ConstantNode":
                return this.evaluateConstant(node as ConstantNode);
            default:
                throw new Error(`Unknown AST node type: ${node.type}`);
        }
    }

    private evaluateBinaryOperation(node: BinaryOperationNode): number {
        const left = this.execute(node.left) || 0;
        const right = this.execute(node.right) || 0;

        switch (node.operator) {
            case "PLUS":
                return left + right;
            case "MINUS":
                return left - right;
            case "MULTIPLY":
                return left * right;
            case "DIVIDE":
                return left / right;
            case "POWER":
                return Math.pow(left, right);
            default:
                throw new Error(`Unknown operator: ${node.operator}`);
        }
    }

    private evaluateUnaryOperation(node: UnaryOperationNode): number {
        const operand = this.execute(node.operand) || 0;

        switch (node.operator) {
            case "MINUS":
                return -operand;
            default:
                throw new Error(`Unknown unary operator: ${node.operator}`);
        }
    }

    private evaluateFunction(node: FunctionNode): number {
        const args = node.arguments.map((arg) => this.execute(arg) || 0);

        const func = builtInFunctions[node.name];
        if (typeof func !== "function") {
            throw new Error(`Unknown function: ${node.name}`);
        }
        const result = func(...args);
        if (Array.isArray(result)) {
            throw new Error(`Function ${node.name} returned an array.`);
        }
        return result;
    }
    private executeAssignment(node: AssignmentNode): number {
        const value = this.execute(node.value) || 0;
        this.variables[node.variable.name] = value;
        return value;
    }
    private evaluateConstant(node: ConstantNode): number {
        switch (node.name) {
            case "PI":
                return Math.PI;
            case "E":
                return Math.E;
            default:
                throw new Error(`Unknown constant: ${node.name}`);
        }
    }
    public setVariable(name: string, value: number): void {
        this.variables[name] = value;
    }
    public getVariable(name: string): number | null {
        return this.variables[name] || null;
    }
    public clearVariables(): void {
        this.variables = {};
    }
    public getVariables(): { [key: string]: number } {
        return this.variables;
    }
    public removeVariable(name: string): void {
        delete this.variables[name];
    }
}
