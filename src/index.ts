
import { Executor } from "./executor/executor";
import { Lexer } from "./lexer/lexer";
import { Parser } from "./parser/parser";
import { createInterface } from "node:readline/promises";
import { ASTNode } from "./types/ast";


const lexer = new Lexer();
const parser = new Parser();
const executor = new Executor();


const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
}); 
console.clear();
console.log("Math Expression Parser and Lexer Initialized.");
console.log("Type 'exit' to quit.");

(async function main() {
    while (true) {
        const input = await rl.question("Enter a math expression: ");
        if (input.trim().toLowerCase() === "exit") {
            console.log("Exiting...");
            break;
        }

        if (input.trim().toLowerCase() === "clear") {
            console.clear();
            console.log("Console cleared.");
            continue;
        }


        
        const tokens = lexer.tokenize(input);
        console.log("Tokens:", tokens);

        try {
            const ast = parser.parse(tokens);
            console.log("AST:", JSON.stringify(ast, null, 2));
            const result = executor.execute(ast as ASTNode);
            console.log("Result:", result);

        } catch (error) {
            console.error("Error parsing expression:", error);
        }


    }
    rl.close();
    
}
)().catch(err => {
    console.error("An error occurred in the main loop:", err);
    rl.close();
});


