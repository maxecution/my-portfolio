import { execSync } from "child_process";

// 1. Get staged files
const staged = execSync("git diff --cached --name-only --diff-filter=ACM", { encoding: "utf-8" })
  .split("\n")
  .filter((f) => f.match(/\.(js|jsx|ts|tsx)$/));

if (staged.length === 0) {
  console.log("No staged JS/TS files.");
  process.exit(0);
}

// 2. Build Jest args
const files = staged.join(" ");
const coverageFrom = staged.map((f) => `'${f}'`).join(",");

// 3. Run Jest
const cmd = `jest --findRelatedTests --passWithNoTests --silent=false --coverage --coverageReporters=text-summary --collectCoverageFrom=[${coverageFrom}] ${files}`;
console.log(`Running: ${cmd}`);
execSync(cmd, { stdio: "inherit", shell: true });
