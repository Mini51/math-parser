import { Executor} from "../src/executor/executor";
import { builtInFunctions } from "../src/helpers/builtIn";
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
} from "../src/types/ast";

describe('Executor', () => {
    let executor: Executor = new Executor();
    const generateAST = (functionName: string, args: any[]): FunctionNode => {
        return {
            type: "FunctionNode",
            name: functionName,
            arguments: args.map(arg => {
                if (typeof arg === 'number') {
                    return {
                        type: "NumberNode",
                        value: arg
                    } as NumberNode;
                }
                return arg;
            })
        };
    };


    beforeEach(() => {
        executor.clearVariables();
    });
    describe('Basic Node Execution', () => {
        it('should execute a number node', () => {
        const result = executor.execute({
            type: "NumberNode",
            value: 42
        } as NumberNode);

        expect(result).toBe(42);
        });
        it('should execute a variable node', () => {
        executor.setVariable('x', 10);
        const result = executor.execute({
            type: "VariableNode",
            name: 'x'
        } as VariableNode);
        expect(result).toBe(10);
        });
        it('should execute a binary operation node', () => {
        // we want to have a full equation so we can make usre all 
        const ast = {
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
        };
        const result = executor.execute(ast);
        expect(result).toBe(-8);
        });
        it('should execute a unary operation node', () => {
        const ast: UnaryOperationNode = {
            type: "UnaryOperationNode",
            operator: "MINUS",
            operand: {
                type: "NumberNode",
                value: 5
            } as NumberNode
        };
        const result = executor.execute(ast);
        expect(result).toBe(-5);
        });
        it('should execute an assignment node', () => {
        const ast: AssignmentNode = {
            type: "AssignmentNode",
            variable: {
                type: "VariableNode",
                name: 'y'
            } as VariableNode,
            value: {
                type: "NumberNode",
                value: 20
            } as NumberNode
        };
        executor.execute(ast);
        expect(executor.getVariable('y')).toBe(20);
        });
        it('should execute an absolute value node', () => {
        const ast: AbsoluteValueNode = {
            type: "AbsoluteValueNode",
            value: {
                type: "UnaryOperationNode",
                operator: "MINUS",
                operand: {
                    type: "NumberNode",
                    value: 5
                } as NumberNode
            } as UnaryOperationNode
        };
        const result = executor.execute(ast);
        expect(result).toBe(5);
        });
        it('should execute a constant node', () => {
        const ast = { 
            type: "BinaryOperationNode",
            operator: "PLUS",
            left: {
                type: "ConstantNode",
                name: "PI"
            },
            right: {
                type: "ConstantNode",
                name: "E"
            }
        }
        const result = executor.execute(ast);
        expect(result).toBeCloseTo(5.859874482048838, 5);
        });
    });

    describe("Context/Variables", () => { 

        it("should set and get variables correctly", () => {
            executor.setVariable('a', 15);
            const result = executor.getVariable('a');
            expect(result).toBe(15);
        });
        it("should get all variables correctly", () => {
            executor.setVariable('a', 15);
            executor.setVariable('b', 25);
            const variables = executor.getVariables();
            expect(variables).toEqual({ a: 15, b: 25 });
        });
        it("should clear variables correctly", () => {
            executor.setVariable('b', 25);
            executor.clearVariables();
            expect(() => executor.getVariable('b')).toThrow("Undefined variable: b");
        });
        it("should delete a variable correctly", () => {
            executor.setVariable('c', 30);
            executor.removeVariable('c');
            expect(() => executor.getVariable('c')).toThrow("Undefined variable: c");
        });
    });

    describe("Error Handeling", () => {
        it('should throw undefined variable', () => {
        const ast: VariableNode = {
            type: "VariableNode",
            name: 'x'
        };
        expect(() => executor.execute(ast)).toThrow("Undefined variable: x");
        });
        it("should throw unknown node type", () => {
        const ast: any = {
            type: "UnknownNode"
        };
        expect(() => executor.execute(ast)).toThrow("Unknown AST node type: UnknownNode");
        });
        it("should throw unknown operators", () => {
        const ast = {
            type: "BinaryOperationNode",
            operator: "UNKNOWN",
            left: {
                type: "NumberNode",
                value: 5
            },
            right: {
                type: "NumberNode",
                value: 3
            }
        };
        expect(() => executor.execute(ast)).toThrow("Unknown operator: UNKNOWN");
        });
        it("should throw division by zero", () => {
        const ast = {
            type: "BinaryOperationNode",
            operator: "DIVIDE",
            left: {
                type: "NumberNode",
                value: 5
            },
            right: {
                type: "NumberNode",
                value: 0
            }
        };
        expect(() => executor.execute(ast)).toThrow("Division by zero");
        });
        it("should throw unknown unary operator", () => {
        const ast: UnaryOperationNode = {
            type: "UnaryOperationNode",
            operator: "UNKNOWN",
            operand: {
                type: "NumberNode",
                value: 5
            } as NumberNode
        };
        expect(() => executor.execute(ast)).toThrow("Unknown unary operator: UNKNOWN");
        });
        it("should throw unknown constant", () => {
        const ast = { 
            type: "BinaryOperationNode",
            operator: "PLUS",
            left: {
                type: "ConstantNode",
                name: "UNKNOWN"
            },
            right: {
                type: "NumberNode",
                value: 5
            }
        }
        expect(() => executor.execute(ast)).toThrow("Unknown constant: UNKNOWN");
        });
        it("should throw if a unknown function is called", () => {
            expect(() => executor.execute(generateAST("unknownFunction", [1]))).toThrow("Unknown function: unknownFunction");
        }); 
    });

    describe("Built-in Functions", () => {
        test("sin", () => { 
            expect(executor.execute(generateAST("sin", [1]))).toBeCloseTo(0.8414709848078965, 5);
            expect(() => executor.execute(generateAST("sin", [Math.PI / 2]))).toThrow("Division by zero in sin function.");
        });
        test("cos", () => {
            expect(executor.execute(generateAST("cos", [1]))).toBeCloseTo(0.5403023058681398, 5);
            expect(() => executor.execute(generateAST("cos", [Math.PI / 2]))).toThrow("Division by zero in cos function.");
        });
        test("tan", () => { 
            expect(executor.execute(generateAST("tan", [1]))).toBeCloseTo(1.5574077246549023, 5);
            expect(() => executor.execute(generateAST("tan", [Math.PI / 2]))).toThrow("Division by zero in tan function.");
        });
        test("csc", () => {
            expect(executor.execute(generateAST("csc", [1]))).toBeCloseTo(1.1883951057781212, 5);
            expect(() => executor.execute(generateAST("csc", [0]))).toThrow("Division by zero in csc function.");
        });
        test("sec", () => {
            expect(executor.execute(generateAST("sec", [1]))).toBeCloseTo(1.850815717680925, 5);
            expect(() => executor.execute(generateAST("sec", [Math.PI / 2]))).toThrow("Division by zero in sec function.");
        });
        test("cot", () => {
            expect(executor.execute(generateAST("cot", [1]))).toBeCloseTo(0.6420926159343306, 5);
            expect(() => executor.execute(generateAST("cot", [0]))).toThrow("Division by zero in cot function.");
        });

        test("asin", () => {
            expect(executor.execute(generateAST("asin", [0.5]))).toBeCloseTo(0.5235987755982989, 5);
            expect(() => executor.execute(generateAST("asin", [2]))).toThrow("asin function domain error.");
        });
        test("acos", () => {
            expect(executor.execute(generateAST("acos", [0.5]))).toBeCloseTo(1.0471975511965979, 5);
            expect(() => executor.execute(generateAST("acos", [2]))).toThrow("acos function domain error.");
        });
        test("atan", () => {
            expect(executor.execute(generateAST("atan", [1]))).toBeCloseTo(0.7853981633974483, 5);
            expect(() => executor.execute(generateAST("atan", [0]))).toThrow("Division by zero in atan function.");
        });
        test("acsc", () => {
            expect(executor.execute(generateAST("acsc", [2]))).toBeCloseTo(0.5235987755982989, 5);
            expect(() => executor.execute(generateAST("acsc", [0]))).toThrow("Division by zero in acsc function.");
            expect(() => executor.execute(generateAST("acsc", [0.5]))).toThrow("acsc function domain error.");
        });
        test("asec", () => {
            expect(executor.execute(generateAST("asec", [2]))).toBeCloseTo(1.0471975511965979, 5);
            expect(() => executor.execute(generateAST("asec", [0]))).toThrow("Division by zero in asec function.");
            expect(() => executor.execute(generateAST("asec", [0.5]))).toThrow("asec function domain error.");
        });
        test("acot", () => {
            expect(executor.execute(generateAST("acot", [1]))).toBeCloseTo(0.7853981633974483, 5);
            expect(() => executor.execute(generateAST("acot", [0]))).toThrow("Division by zero in acot function.");
        });

        test("sinh", () => {
            expect(executor.execute(generateAST("sinh", [1]))).toBeCloseTo(1.1752011936438014, 5);
        });
        test("cosh", () => {
            expect(executor.execute(generateAST("cosh", [1]))).toBeCloseTo(1.5430806348152437, 5);
        });
        test("tanh", () => {
            expect(executor.execute(generateAST("tanh", [1]))).toBeCloseTo(0.7615941559557649, 5);
        });
        test("csch", () => {
            expect(executor.execute(generateAST("csch", [1]))).toBeCloseTo(0.8509181282393216, 5);
        });
        test("sech", () => {
            expect(executor.execute(generateAST("sech", [1]))).toBeCloseTo(0.6480542736638854, 5);
        });
        test("coth", () => {
            expect(executor.execute(generateAST("coth", [1]))).toBeCloseTo(1.3130352854993315, 5);
        });
        
        test("lcm", () => {
            expect(executor.execute(generateAST("lcm", [4, 6]))).toBe(12);
        });
        test("gcd", () => {
            expect(executor.execute(generateAST("gcd", [48, 18]))).toBe(6);
        });
        test("mod", () => {
            expect(executor.execute(generateAST("mod", [5, 2]))).toBe(1);
            expect((() => executor.execute(generateAST("mod", [100, 0])))).toThrow("Division by zero in mod function.");
        });
        test("ceil", () => {
            expect(executor.execute(generateAST("ceil", [3.14]))).toBe(4);
        });
        test("floor", () => {
            expect(executor.execute(generateAST("floor", [3.14]))).toBe(3);
        });
        test("round", () => {
            expect(executor.execute(generateAST("round", [3.14]))).toBe(3);
            expect(executor.execute(generateAST("round", [3.5,1]))).toBe(3.5);
            expect((() => executor.execute(generateAST("round", [3.5,-1])))).toThrow("Round percision must be non-negative.");
            
        });
        test("sign", () => {
            expect(executor.execute(generateAST("sign", [5]))).toBe(1);
            expect(executor.execute(generateAST("sign", [-5]))).toBe(-1);
            expect(executor.execute(generateAST("sign", [0]))).toBe(0);
        });
        test("nthroot", () => {
            expect(executor.execute(generateAST("nthroot", [27, 3]))).toBe(3);
            expect(() => executor.execute(generateAST("nthroot", [2, 0]))).toThrow("Division by zero in nthroot function.");
        });
    });
});
