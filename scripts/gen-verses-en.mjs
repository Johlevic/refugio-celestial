import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const appJs = fs.readFileSync(path.join(root, "legacy", "app.js"), "utf8");
const k = appJs.indexOf("const CURATED_VERSES = ");
if (k === -1) throw new Error("CURATED_VERSES not found");
const st = appJs.indexOf("{", k);
let depth = 0;
let i = st;
for (; i < appJs.length; i++) {
  const c = appJs[i];
  if (c === "{") depth++;
  else if (c === "}") {
    depth--;
    if (depth === 0) {
      i++;
      break;
    }
  }
}
const objStr = appJs.slice(st, i);
// eslint-disable-next-line no-new-func
const CV = Function(`"use strict"; return (${objStr})`)();
const en = CV.en;
const verses = [];
let n = 1;
for (const [cat, arr] of Object.entries(en)) {
  for (const v of arr) {
    verses.push({
      id: n++,
      book: "",
      chapter: 0,
      verse: 0,
      text: v.text,
      ref: v.ref,
      categories: [cat],
    });
  }
}
const out = {
  metadata: {
    version: "1.0.0",
    language: "en",
    translation: "Curated (KJV-style references)",
    total_verses: verses.length,
    categories: {
      comfort: "Comfort & peace",
      wisdom: "Wisdom",
      hope: "Hope & promises",
      love: "Love",
      repentance: "Repentance & forgiveness",
    },
  },
  verses,
};
fs.writeFileSync(
  path.join(root, "src", "data", "verses-en.json"),
  JSON.stringify(out, null, 2),
  "utf8"
);
console.log("Wrote", verses.length, "English verses to src/data/verses-en.json");
