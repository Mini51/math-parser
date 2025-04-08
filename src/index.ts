import { Executor } from "./executor/executor";
import { Lexer } from "./lexer/lexer";
import { Parser } from "./parser/parser";
import { createInterface } from "node:readline/promises";
import { ASTNode } from "./types/ast";
import { debugLog } from "./helpers/debug";

import * as dotenv from 'dotenv';
import { Token } from "./types/tokens";
import { debug } from "node:console";
dotenv.config();


debugLog("MAIN", "Initializing REPL...");

const lexer = new Lexer();
const parser = new Parser();
const executor = new Executor();

const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
});
let replActive = true;

debugLog("REPL", "REPL initialized. Awaiting input...");


(async function main() {
    while (replActive) {
        const input = await rl.question("Enter a math expression: ");
        
        switch(input.trim().toLowerCase()) {
            case ">exit":
                console.log("Exiting REPL...");
                replActive = false;
                rl.close(); // Close the readline interface
                return;
            case ">clear":
                console.clear();
                continue
            case ">context":
                    console.log("Current context variables:");
                    console.table(executor.getVariables());
                    continue;
            case ">help":
                console.log("Available commands:");
                console.log(">exit - Exit the REPL");
                console.log(">clear - Clear the console");
                console.log(">context - Show current context variables");
                console.log(">help - Show this help message");
                continue;
        }


        try { 
            const tokens = lexer.tokenize(input);
            const ast = parser.parse(tokens);
            const result = executor.execute(ast as ASTNode);
            console.log("Result:", result);
        } catch (err) {
            console.error(err);
        }
    }
    rl.close();
})().catch((err) => {
    console.error("An error occurred in the main loop:", err);
    rl.close();
});
