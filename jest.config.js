module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    collectCoverage: true,
    collectCoverageFrom: [
        "**/*.{ts,tsx}",
        "!**/node_modules/**",
        "!**/helpers/**",
        "!**/src/index.ts",
        "!**/warning.ts",
        "!**/types/**",
    ],
};
