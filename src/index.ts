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


debugLog("REPL", "REPL initialized. Awaiting input...");


(async function main() {
    while (true) {
        const input = await rl.question("Enter a math expression: ");
        if (input.trim().toLowerCase() === "exit") {
            break;
        }

        if (input.trim().toLowerCase() === "clear") {
            console.clear();
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
