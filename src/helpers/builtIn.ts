import { sign } from "crypto";

export const builtInFunctions: Record<
    string,
    (...args: any[]) => number | number[]
> = {
    // Trig Functions
    sin: (x: number) => {
        if (x === Math.PI / 2 || x === -Math.PI / 2) {
            throw new Error("Division by zero in sin function.");
        }
        return Math.sin(x);
    },
    cos: (x: number) => {
        if (x === Math.PI / 2 || x === -Math.PI / 2) {
            throw new Error("Division by zero in cos function.");
        }
        return Math.cos(x);
    },
    tan: (x: number) => {
        if (x === Math.PI / 2 || x === -Math.PI / 2) {
            throw new Error("Division by zero in tan function.");
        }
        return Math.tan(x);
    },
    csc: (x: number) => {
        if (x === 0) {
            throw new Error("Division by zero in csc function.");
        }
        return 1 / Math.sin(x);
    },
    sec: (x: number) => {
        if (x === Math.PI / 2 || x === -Math.PI / 2) {
            throw new Error("Division by zero in sec function.");
        }
        return 1 / Math.cos(x);
    },
    cot: (x: number) => {
        if (x === 0) {
            throw new Error("Division by zero in cot function.");
        }
        return 1 / Math.tan(x);
    },
    // Inverse Trig Functions
    asin: (x: number) => {
        if (x < -1 || x > 1) {
            throw new Error("asin function domain error.");
        }
        return Math.asin(x);
    },
    acos: (x: number) => {
        if (x < -1 || x > 1) {
            throw new Error("acos function domain error.");
        }
        return Math.acos(x);
    },
    atan: (x: number) => {
        if (x === 0) {
            throw new Error("Division by zero in atan function.");
        }
        return Math.atan(x);
    },
    acsc: (x: number) => {
        if (x === 0) {
            throw new Error("Division by zero in acsc function.");
        }
        if (Math.abs(x) < 1) {
            throw new Error("acsc function domain error.");
        }
        return Math.asin(1 / x);
    },
    asec: (x: number) => {
        if (x === 0) {
            throw new Error("Division by zero in asec function.");
        }
        if (Math.abs(x) < 1) {
            throw new Error("asec function domain error.");
        }
        return Math.acos(1 / x);
    },
    acot: (x: number) => {
        if (x === 0) {
            throw new Error("Division by zero in acot function.");
        }
        return Math.atan(1 / x);
    },
    // Hyperbolic Trig Functions
    sinh: (x: number) => {
        if (x === 0) {
            throw new Error("Division by zero in sinh function.");
        }
        return Math.sinh(x);
    },
    cosh: (x: number) => {
        if (x === 0) {
            throw new Error("Division by zero in cosh function.");
        }
        return Math.cosh(x);
    },
    tanh: (x: number) => {
        if (x === 0) {
            throw new Error("Division by zero in tanh function.");
        }
        return Math.tanh(x);
    },
    csch: (x: number) => {
        if (x === 0) {
            throw new Error("Division by zero in csch function.");
        }
        return 1 / Math.sinh(x);
    },
    sech: (x: number) => {
        if (x === 0) {
            throw new Error("Division by zero in sech function.");
        }
        return 1 / Math.cosh(x);
    },
    coth: (x: number) => {
        if (x === 0) {
            throw new Error("Division by zero in coth function.");
        }
        return 1 / Math.tanh(x);
    },
    // Number theory Functions
    lcm: (...args: number[]) => {
        const gcd = (a: number, b: number): number => {
            if (b === 0) return a;
            return gcd(b, a % b);
        };
        return args.reduce((a, b) => (a * b) / gcd(a, b));
    },
    gcd: (...args: number[]) => {
        const gcd = (a: number, b: number): number => {
            if (b === 0) return a;
            return gcd(b, a % b);
        };
        return args.reduce(gcd);
    },
    mod: (x: number, y: number) => {
        if (y === 0) {
            throw new Error("Division by zero in mod function.");
        }
        return x % y;
    },
    ceil: (x: number) => {
        return Math.ceil(x);
    },
    floor: (x: number) => {
        return Math.floor(x);
    },
    round: (x: number, y: number) => {
        if (!y) {
            return Math.round(x);
        }
        if (y < 0) {
            throw new Error("Round function only accepts positive values.");
        }
        if (y === 0) {
            return Math.round(x);
        }
        const factor = Math.pow(10, y);
        return Math.round(x * factor) / factor;
    },
    sign: (x: number) => {
        if (x > 0) return 1;
        if (x < 0) return -1;
        return 0;
    },
    nthroot: (x: number, n: number) => {
        if (n === 0) {
            throw new Error("Division by zero in nthroot function.");
        }
        return Math.pow(x, 1 / n);
    },
};
