import pkg from "./package.json";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import babel from "@rollup/plugin-babel";
import replace from "@rollup/plugin-replace";
import { terser } from "rollup-plugin-terser";
const extensions = [".ts"];
const noDeclarationFiles = { compilerOptions: { declaration: false } };
// 外部包
const makeExternalPredicate = (externalArr) => {
    if (externalArr.length === 0) {
        return () => false;
    }
    const pattern = new RegExp(`^(${externalArr.join("|")})($|/)`);
    return (id) => pattern.test(id);
};
export default [
    // CommonJS
    {
        input: "src/index.ts",
        output: { file: "lib/ssmutil.js", format: "cjs", indent: false },
        external: makeExternalPredicate([
            ...Object.keys(pkg.dependencies || {}),
            ...Object.keys(pkg.peerDependencies || {}),
        ]),
        plugins: [
            nodeResolve({ extensions }),
            typescript({ useTsconfigDeclarationDir: true }),
            babel({
                extensions,
                exclude: "node_modules/**", // 只编译我们的源代码
            }),
        ],
    },
    // es
    {
        input: "src/index.ts",
        output: { file: "es/ssmutil.js", format: "es", indent: false },
        external: makeExternalPredicate([
            ...Object.keys(pkg.dependencies || {}),
            ...Object.keys(pkg.peerDependencies || {}),
        ]),
        plugins: [
            nodeResolve({ extensions }),
            typescript({ useTsconfigDeclarationDir: true }),
            babel({
                extensions,
                exclude: "node_modules/**", // 只编译我们的源代码
            }),
        ],
    },
    // ES for Browsers
    {
        input: "src/index.ts",
        output: { file: "es/ssmutil.mjs", format: "es", indent: false },
        plugins: [
            nodeResolve({
                extensions,
            }),
            replace({
                "process.env.NODE_ENV": JSON.stringify("production"),
            }),
            typescript({ tsconfigOverride: noDeclarationFiles }),
            babel({
                extensions,
                exclude: "node_modules/**",
            }),
            terser({
                compress: {
                    pure_getters: true,
                    unsafe: true,
                    unsafe_comps: true,
                    warnings: false,
                },
            }),
        ],
    },
    // UMD Development
    {
        input: "src/index.ts",
        output: {
            file: "dist/ssmutil.js",
            format: "umd",
            name: "ssmutil",
            indent: false,
        },
        plugins: [
            nodeResolve({
                extensions,
            }),
            typescript({ tsconfigOverride: noDeclarationFiles }),
            babel({
                extensions,
                exclude: "node_modules/**",
            }),
            replace({
                "process.env.NODE_ENV": JSON.stringify("development"),
            }),
        ],
    },
    // UMD Production
    {
        input: "src/index.ts",
        output: {
            file: "dist/ssmutil.min.js",
            format: "umd",
            name: "ssmutil",
            indent: false,
        },
        plugins: [
            nodeResolve({
                extensions,
            }),
            typescript({ tsconfigOverride: noDeclarationFiles }),
            babel({
                extensions,
                exclude: "node_modules/**",
            }),
            replace({
                "process.env.NODE_ENV": JSON.stringify("production"),
            }),
            terser({
                compress: {
                    pure_getters: true,
                    unsafe: true,
                    unsafe_comps: true,
                    warnings: false,
                },
            }),
        ],
    },
];
