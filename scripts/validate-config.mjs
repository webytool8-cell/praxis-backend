import fs from "node:fs";

const files = ["package.json", ".eslintrc.json", "vercel.json"];

for (const file of files) {
  const raw = fs.readFileSync(file, "utf8");
  if (/^(<<<<<<<|=======|>>>>>>>)/m.test(raw)) {
    console.error(`Conflict markers found in ${file}`);
    process.exit(1);
  }

  try {
    JSON.parse(raw);
  } catch (error) {
    console.error(`Invalid JSON in ${file}: ${error.message}`);
    process.exit(1);
  }

  console.log(`OK ${file}`);
}
