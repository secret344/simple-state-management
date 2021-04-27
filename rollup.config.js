import pkg from "./package.json";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import babel from "@rollup/plugin-babel";
const extensions = [".ts"];
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
        output: { file: "lib/SMU.js", format: "cjs", indent: false },
        external: makeExternalPredicate([
            ...Object.keys(pkg.dependencies || {}),
            ...Object.keys(pkg.peerDependencies || {}),
        ]),
        plugins: [
            nodeResolve({ extensions }),
            typescript(),
            babel({
                extensions,
                exclude: "node_modules/**", // 只编译我们的源代码
            }),
        ],
    },
];
