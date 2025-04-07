# math-parser
A math parser written in TypeScript (TS). This library is designed to parse and evaluate mathematical expressions efficiently and accurately.

## Features
- Written in TypeScript for type safety and modern JavaScript compatibility.
- Supports a wide range of mathematical operations and functions.
- Lightweight and easy to integrate into your projects.
- Extensible for custom operations and syntax.

## Math Syntax Supported
The parser supports the following mathematical syntax:
- Basic arithmetic: `+`, `-`, `*`, `/`
- Parentheses for grouping: `( )`
- Exponentiation: `^`
- Functions: `sin`, `cos`, `tan`, `log`, `sqrt`, etc.
- Constants: `pi`, `e`
- Variables: Custom variables can be defined and used in expressions. **Note: User-defined variables must be single characters (e.g., `x`, `y`, `z`). Multi-character names (e.g., `asdf`) will be treated as separate variables.**
- **User-defined functions must also have single-character names.** 

## Installation
Install the package via npm:
```bash
npm install math-parser
```

## Usage
Here’s a quick example of how to use the math-parser:
```typescript
import { parseExpression, evaluate } from 'math-parser';

const expression = '3 * (2 + 5) ^ 2';
const parsed = parseExpression(expression);
const result = evaluate(parsed);

console.log(`Result: ${result}`); // Output: Result: 147
```

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request with your changes.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
