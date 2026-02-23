import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const IGNORE_DIRS = new Set([".git", "node_modules", ".next"]);
const MERGE_PATTERN = /^(<<<<<<<|=======|>>>>>>>)/m;

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (IGNORE_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else {
      const rel = path.relative(ROOT, full);
      const raw = fs.readFileSync(full, "utf8");

      if (MERGE_PATTERN.test(raw)) {
        throw new Error(`Merge conflict markers found in ${rel}`);
      }

      if (rel.endsWith(".json")) {
        try {
          JSON.parse(raw);
        } catch (error) {
          throw new Error(`Invalid JSON in ${rel}: ${error.message}`);
        }
      }
    }
  }
}

walk(ROOT);
console.log("OK merge-state validation");
