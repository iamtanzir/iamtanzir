#!/usr/bin/env node
// Update the README clock image URL with a fresh cache-buster so GitHub's
// camo proxy fetches a new SVG instead of serving a stale cached frame.
import { readFileSync, writeFileSync } from "node:fs";

const path = "README.md";
let md = readFileSync(path, "utf8");
md = md.replace(
  /(https:\/\/live-clock\.tanzir-ahmed\.workers\.dev\/)\?v=\d+/g,
  "$1?v=" + Date.now(),
);
if (!md.includes("live-clock.tanzir-ahmed.workers.dev/?v=")) {
  md = md.replace(
    "https://live-clock.tanzir-ahmed.workers.dev/",
    "https://live-clock.tanzir-ahmed.workers.dev/?v=" + Date.now(),
  );
}
writeFileSync(path, md);
console.log("busted README clock cache");
