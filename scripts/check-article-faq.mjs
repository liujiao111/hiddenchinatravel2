import fs from "node:fs";
import path from "node:path";

const directories = ["_posts", "_posts-zh"];
const faqHeading = /^#{2,3}\s*(?:FAQ(?:s)?|Frequently Asked Questions|常见问题|常见问答)\s*$/gim;
let scanned = 0;
const failures = [];

for (const directory of directories) {
  if (!fs.existsSync(directory)) continue;
  for (const filename of fs.readdirSync(directory).filter((name) => name.endsWith(".md"))) {
    const file = path.join(directory, filename);
    const source = fs.readFileSync(file, "utf8");
    const parts = /^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n([\s\S]*)$/.exec(source);
    scanned++;
    if (!parts) continue;
    const [, frontmatter, body] = parts;
    const hasFrontmatterFaq = /^faqs:\s*$/m.test(frontmatter);
    faqHeading.lastIndex = 0;
    const inlineHeading = faqHeading.exec(body);
    if (hasFrontmatterFaq && inlineHeading) {
      failures.push(`${file}: frontmatter.faqs plus inline heading "${inlineHeading[0].trim()}"`);
    }
  }
}

if (failures.length) {
  console.error(`Duplicate FAQ sources in ${failures.length} article(s):\n${failures.join("\n")}`);
  console.error("Keep questions in frontmatter.faqs and remove only the duplicate body FAQ section. See PROJECT.md §19.");
  process.exitCode = 1;
} else {
  console.log(`FAQ source check passed for ${scanned} articles.`);
}
