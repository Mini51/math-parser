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
import { debugLog } from "../helpers/debug";
import { debug } from "console";

export class Executor {
    private variables: { [key: string]: number } = {};

    private debugLogContext(message: string, node: ASTNode): void {
        debugLog("EXECUTOR", `${message} | Node Type: ${node.type}`);
    }

    public execute(node: ASTNode): number | null {
        this.debugLogContext("Executing node", node);

        switch (node.type) {
            case "NumberNode":
                return this.executeNumber(node as NumberNode);
            case "VariableNode":
                return this.executeVariable(node as VariableNode);
            case "BinaryOperationNode":
                return this.executeBinaryOperation(node as BinaryOperationNode);
            case "FunctionNode":
                return this.executeFunction(node as FunctionNode);
            case "AssignmentNode":
                return this.executeAssignment(node as AssignmentNode);
            case "AbsoluteValueNode":
                return this.executeAbsoluteValue(node as AbsoluteValueNode);
            case "ConstantNode":
                return this.executeConstant(node as ConstantNode);
            case "UnaryOperationNode":
                return this.executeUnaryOperation(node as UnaryOperationNode);
            default:
                throw new Error(`Unknown AST node type: ${node.type}`);
        }
    }

    private executeNumber(node: NumberNode): number {
        this.debugLogContext("Executing NumberNode", node);
        return node.value;
    }

    private executeVariable(node: VariableNode): number {
        this.debugLogContext("Executing VariableNode", node);
        if (!(node.name in this.variables)) {
            throw new Error(`Undefined variable: ${node.name}`);
        }
        return this.variables[node.name];
    }

    private executeBinaryOperation(node: BinaryOperationNode): number {
        this.debugLogContext("Executing BinaryOperationNode", node);
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
                if (right === 0) throw new Error("Division by zero");
                return left / right;
            case "POWER":
                return Math.pow(left, right);
            default:
                throw new Error(`Unknown operator: ${node.operator}`);
        }
    }

    private executeUnaryOperation(node: UnaryOperationNode): number {
        this.debugLogContext("Executing UnaryOperationNode", node);
        const operand = this.execute(node.operand) || 0;

        switch (node.operator) {
            case "MINUS":
                return -operand;
            default:
                throw new Error(`Unknown unary operator: ${node.operator}`);
        }
    }

    private executeFunction(node: FunctionNode): number {
        this.debugLogContext("Executing FunctionNode", node);
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
        this.debugLogContext("Executing AssignmentNode", node);
        const value = this.execute(node.value) || 0;
        this.variables[node.variable.name] = value;
        return value;
    }

    private executeAbsoluteValue(node: AbsoluteValueNode): number {
        this.debugLogContext("Executing AbsoluteValueNode", node);
        const value = this.execute(node.value) || 0;
        return Math.abs(value);
    }

    private executeConstant(node: ConstantNode): number {
        this.debugLogContext("Executing ConstantNode", node);
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
