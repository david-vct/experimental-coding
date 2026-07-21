// Check if a JS program is a quine: node quine-cert.js <file>
const { readFileSync } = require("fs");
const { execFileSync } = require("child_process");

const file = process.argv[2];
const src = readFileSync(file, "utf8");
const out = execFileSync("node", [file], { encoding: "utf8" });

// A quine reproduces its own source (we allow the final \n from console.log).
console.log(out === src || out === src + "\n");