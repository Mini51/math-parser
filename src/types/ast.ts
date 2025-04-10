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
    operator: string; 
    left: ASTNode;
    right: ASTNode;
}

export interface UnaryOperationNode extends ASTNode {
    type: "UnaryOperationNode";
    operator: string; 
    operand: ASTNode;
}

export interface FunctionNode extends ASTNode {
    type: "FunctionNode";
    name: string; 
    arguments: ASTNode[]; 
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
    name: "PI" | "E"; 
}

export interface ParenthesisNode extends ASTNode {
    type: "ParenthesisNode";
    content: ASTNode; 
}

export interface CommaNode extends ASTNode {
    type: "CommaNode";
}