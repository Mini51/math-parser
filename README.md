# math-parser

![Code Coverage](./coverage-badge.svg)

A math parser written in TypeScript (TS). This library is designed to parse and evaluate mathematical expressions efficiently and accurately.

## Features

-   Written in TypeScript for type safety and modern JavaScript compatibility.
-   Supports a wide range of mathematical operations and functions.
-   Lightweight and easy to integrate into your projects.
-   Extensible for custom operations and syntax.

## Usage

The current state of this parser is a work in progress therefore it is not recommended for production use.
If you would like to use this parser you can build it and use the example located in the index.ts file.

```bash

# Clone the repository
git clone https://github.com/mini51/math-parser.git
cd math-parser

# Install dependencies
yarn

# Build the project
tsc

# Run the example
node dist/index.js
```

once you have built the parser you can use its repl to test out the parser.

**NOTE** The repl does provide some functions that you can call by prefixing your input with `>`.

### REPL Commands

The following commands are available in the REPL:

- `>help` - Displays a list of available commands.
- `>context` - Lists all defined variables and their values.
- `>clear` - Clears all defined variables.
- `>exit` - Exits the REPL.

## Parser

The parser supports the following mathematical syntax:

-   Basic arithmetic: `+`, `-`, `*`, `/`, `^`
-   Parentheses for grouping: `( )`
-   Functions: `sin`, `cos`, `tan`, `log`, `sqrt`, [see below for more functions](#built-in-functions)
-   Constants: `pi`, `e`
-   Variables: Do support user defined variables but they must be 1 character long.

## Built-in Functions

The parser includes a variety of built-in functions for mathematical operations. Below is a list of the supported functions:

<details closed>
<summary>Trig Functions</summary>

-   sin(x)
    -   Returns the sine of `x` (x in radians).
-   cos(x)
    -   Returns the cosine of `x` (x in radians).
-   tan(x)
    -   Returns the tangent of `x` (x in radians).
-   csc(x)
    -   Returns the cosecant of `x` (x in radians).
-   sec(x)
    -   Returns the secant of `x` (x in radians).
-   cot(x)
    -   Returns the cotangent of `x` (x in radians).

</details>
<details closed>
<summary>Inverse Trig Functions</summary>

-   asin(x)
    -   Returns the arcsine of `x` (x in radians).
-   acos(x)
    -   Returns the arccosine of `x` (x in radians).
-   atan(x)
    -   Returns the arctangent of `x` (x in radians).
-   acsc(x)
    -   Returns the arccosecant of `x` (x in radians).
-   asec(x)
    -   Returns the arcsecant of `x` (x in radians).
-   acot(x) - Returns the arccotangent of `x` (x in radians).

</details>
<details closed>
<summary>Hyperbolic Trig Functions</summary>

-   sinh(x)
    -   Returns the hyperbolic sine of `x` (x in radians).
-   cosh(x)
    -   Returns the hyperbolic cosine of `x` (x in radians).
-   tanh(x)
    -   Returns the hyperbolic tangent of `x` (x in radians).
-   csch(x)
    -   Returns the hyperbolic cosecant of `x` (x in radians).
-   sech(x)
    -   Returns the hyperbolic secant of `x` (x in radians).
-   coth(x) - Returns the hyperbolic cotangent of `x` (x in radians).

</details>
<details closed>
<summary>Number Theory Functions</summary>

-   lcm(...args)
    -   Returns the least common multiple of the given numbers.
-   gcd(...args)
    -   Returns the greatest common divisor of the given numbers.
-   mod(x, y)
    -   Returns the remainder of the division of `x` by `y`.
-   ceil(x)
    -   Returns the smallest integer greater than or equal to `x`.
-   floor(x)
    -   Returns the largest integer less than or equal to `x`.
-   round(x, n)
    -   Returns `x` rounded to `n` decimal places.
-   sign(x)
    -   Returns the sign of `x` (-1 for negative, 0 for zero, 1 for positive).
-   nthroot(x, n) - Returns the `n` root of `x`.

</details>

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
