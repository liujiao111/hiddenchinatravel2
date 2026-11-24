import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative, sep } from "node:path";

// Existing published images are grandfathered only while their bytes remain
// unchanged. Every new/replaced image must be WebP and <= 500 KB.
const root = process.cwd();
const maxBytes = 500_000;
const photoDirectories = ["blog", "destinations", "customers", "journeys", "planning", "experiences"];
const { legacy } = JSON.parse(readFileSync(join(root, "scripts/image-legacy-allowlist.json"), "utf8"));
const issues = [];
let checked = 0;
let grandfathered = 0;

function gitBlobSha(data) {
  const prefix = Buffer.from("blob " + data.length + "\0");
  return createHash("sha1").update(prefix).update(data).digest("hex");
}

function scan(dir) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      scan(path);
      continue;
    }
    if (!entry.isFile() || !/\.(?:webp|avif|png|jpe?g)$/i.test(entry.name)) continue;
    checked++;
    const normalizedPath = relative(root, path).split(sep).join("/");
    const bytes = statSync(path).size;
    const validFormat = /\.webp$/i.test(entry.name);
    if (validFormat && bytes <= maxBytes) continue;
    const approvedSha = legacy[normalizedPath];
    const fileData = approvedSha ? readFileSync(path) : null;
    if (approvedSha && gitBlobSha(fileData) === approvedSha) {
      grandfathered++;
      continue;
    }
    issues.push(normalizedPath + ": " + bytes.toLocaleString("en-US") +
      " bytes, " + extname(entry.name) + " — only WebP <= 500,000 bytes allowed for new/modified photos");
  }
}

for (const dir of photoDirectories) scan(join(root, "public/assets", dir));

const requiredOptimized = [
  "public/assets/destinations/yunnan/shaxi/AEA90834-C386-4023-84A9-B7E29C6569E7.webp",
  "public/assets/destinations/yunnan/shaxi/38F5AAF2-AD1C-4D3D-B035-5B9109C589D9.webp",
  "public/assets/blog/china-visa-free-countries-2026/passport-with-entry-stamps-from-multiple-countries-scaled.webp",
  "public/assets/destinations/yunnan/lijiang-shangri-la/lijiang-railway-station-entrance.webp",
];
for (const path of requiredOptimized) if (!existsSync(join(root, path))) issues.push("Missing optimized image: " + path);

if (issues.length) {
  console.error("\nImage quality gate failed:\n" + issues.map(x => " - " + x).join("\n"));
  console.error("\nCompress photographs as WebP to <=500 KB before publishing. Legacy files pass only if unchanged.");
  process.exit(1);
}
console.log("Image check OK: " + checked + " images scanned; " + grandfathered + " unchanged legacy exceptions.");
