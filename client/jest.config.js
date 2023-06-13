/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ["./src"],
  moduleDirectories: ["node_modules", "src"]
};

export default config