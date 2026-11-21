import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

// assets ফোল্ডার না থাকলে তৈরি করা
const assetsDir = path.join(process.cwd(), 'assets');
if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
}

// clock.mjs থেকে SVG জেনারেট করে assets/bd-clock.svg ফাইলে সেভ করা
const svg = execFileSync(process.execPath, ["scripts/clock.mjs"], { encoding: "utf8" });
fs.writeFileSync(path.join(assetsDir, "bd-clock.svg"), svg);
console.log("✅ Mini Digital Clock SVG generated successfully at assets/bd-clock.svg!");
