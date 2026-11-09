#!/usr/bin/env node
/**
 * Generates the static brand assets for the profile README:
 *   assets/hero.svg
 *   assets/sec-*.svg
 *   assets/footer.svg
 *
 * Run: node scripts/build-assets.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "assets");
mkdirSync(outDir, { recursive: true });

const GREEN = "#00ff88";
const DIM = "#0e3a26";
const GREY = "#7f9c8d";
const WHITE = "#e9fff5";
const MONO = "'JetBrains Mono',Consolas,'Courier New',monospace";
const SANS = "'Segoe UI','Helvetica Neue',Arial,sans-serif";

/* ------------------------------------------------------------------ helpers */
const defs = (id) => `
  <defs>
    <pattern id="grid-${id}" width="28" height="28" patternUnits="userSpaceOnUse">
      <path d="M 28 0 L 0 0 0 28" fill="none" stroke="${GREEN}" stroke-width="0.7" opacity="0.05"/>
    </pattern>
    <radialGradient id="glow-${id}" cx="50%" cy="0%" r="85%">
      <stop offset="0%" stop-color="${GREEN}" stop-opacity="0.18"/>
      <stop offset="60%" stop-color="${GREEN}" stop-opacity="0.03"/>
      <stop offset="100%" stop-color="${GREEN}" stop-opacity="0"/>
    </radialGradient>
    <filter id="soft-${id}" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6"/>
    </filter>
  </defs>`;

const corner = (x, y, dx, dy, len = 22) =>
  `<path d="M ${x} ${y + dy * len} L ${x} ${y} L ${x + dx * len} ${y}" stroke="${GREEN}" stroke-width="2.2" fill="none" opacity="0.85"/>`;

/* -------------------------------------------------------------------- hero */
function hero() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="400" viewBox="0 0 1200 400" role="img" aria-label="A.K.M Tanzir Ahmed — Senior DevOps Engineer">
  ${defs("hero")}
  <rect width="1200" height="400" rx="20" fill="#000000"/>
  <rect width="1200" height="400" rx="20" fill="url(#grid-hero)"/>
  <ellipse cx="420" cy="40" rx="620" ry="300" fill="url(#glow-hero)"/>
  <rect x="1" y="1" width="1198" height="398" rx="20" fill="none" stroke="#123a27" stroke-width="1.4"/>
  ${corner(20, 20, 1, 1)}
  ${corner(1180, 20, -1, 1)}
  ${corner(20, 380, 1, -1)}
  ${corner(1180, 380, -1, -1)}

  <!-- title bar -->
  <rect x="1" y="1" width="1198" height="40" rx="20" fill="#040a07"/>
  <rect x="1" y="30" width="1198" height="12" fill="#040a07"/>
  <line x1="1" y1="41" x2="1199" y2="41" stroke="#123a27"/>
  <circle cx="28" cy="21" r="5" fill="#ff5f57"/>
  <circle cx="46" cy="21" r="5" fill="#febc2e"/>
  <circle cx="64" cy="21" r="5" fill="#28c840"/>
  <text x="90" y="25" font-family="${MONO}" font-size="11.5" letter-spacing="2" fill="${GREY}">tanzir@devops: ~/profile</text>
  <text x="1178" y="25" text-anchor="end" font-family="${MONO}" font-size="11" letter-spacing="2" fill="#2f5544">zsh · utf-8 · 120x40</text>

  <!-- monogram -->
  <g transform="translate(58 88)">
    <rect width="112" height="112" rx="16" fill="#020a06" stroke="${GREEN}" stroke-width="1.6"/>
    <rect x="8" y="8" width="96" height="96" rx="11" fill="none" stroke="#0f3d29"/>
    <text x="56" y="70" text-anchor="middle" font-family="${MONO}" font-size="44" font-weight="700" fill="${GREEN}">TA</text>
    <circle cx="56" cy="88" r="3" fill="${GREEN}">
      <animate attributeName="opacity" values="1;0.15;1" dur="1.8s" repeatCount="indefinite"/>
    </circle>
  </g>

  <!-- identity -->
  <text x="202" y="132" font-family="${SANS}" font-size="45" font-weight="700" fill="${WHITE}" letter-spacing="0.6">A.K.M TANZIR AHMED</text>
  <text x="204" y="166" font-family="${MONO}" font-size="14.5" letter-spacing="6.2" fill="${GREEN}">SENIOR DEVOPS ENGINEER</text>
  <line x1="204" y1="186" x2="640" y2="186" stroke="#123a27"/>
  <text x="204" y="212" font-family="${MONO}" font-size="12.5" letter-spacing="1.2" fill="${GREY}">Cloud Infrastructure · Kubernetes · CI/CD · Platform Engineering · DevSecOps</text>
  <text x="204" y="234" font-family="${MONO}" font-size="12.5" letter-spacing="1.2" fill="${GREY}">Dhaka, Bangladesh · UTC+06:00 · Remote worldwide</text>

  <!-- terminal -->
  <g transform="translate(700 78)">
    <rect width="444" height="236" rx="12" fill="#020a06" stroke="#134330" stroke-width="1.2"/>
    <rect width="444" height="26" rx="12" fill="#051009"/>
    <rect y="14" width="444" height="12" fill="#051009"/>
    <line x1="0" y1="26" x2="444" y2="26" stroke="#134330"/>
    <text x="14" y="18" font-family="${MONO}" font-size="10.5" letter-spacing="2" fill="#3f6b56">~/ops/status.log</text>
    <g font-family="${MONO}" font-size="12.6">
      <text x="18" y="52" fill="${GREEN}">$</text><text x="36" y="52" fill="${WHITE}"> whoami</text>
      <text x="36" y="72" fill="${GREY}">devops · sre · security researcher</text>
      <text x="18" y="98" fill="${GREEN}">$</text><text x="36" y="98" fill="${WHITE}"> uptime</text>
      <text x="36" y="118" fill="${GREY}">8+ years · shipping 99.99% systems</text>
      <text x="18" y="144" fill="${GREEN}">$</text><text x="36" y="144" fill="${WHITE}"> stack --top</text>
      <text x="36" y="164" fill="${GREY}">aws · k8s · terraform · argocd · grafana</text>
      <text x="18" y="190" fill="${GREEN}">$</text><text x="36" y="190" fill="${WHITE}"> status</text>
      <text x="36" y="210" fill="${GREEN}">[ ONLINE ]</text><text x="118" y="210" fill="${GREY}">open to high-impact remote roles</text>
    </g>
    <rect x="18" y="222" width="8" height="14" fill="${GREEN}" opacity="0.9">
      <animate attributeName="opacity" values="0.9;0.05;0.9" dur="1.1s" repeatCount="indefinite"/>
    </rect>
  </g>

  <!-- chips -->
  ${["AWS", "KUBERNETES", "TERRAFORM", "GITOPS", "SRE", "SECURITY"]
    .map((label, i) => {
      const x = 58 + i * 128;
      return `<g transform="translate(${x} 300)"><rect width="116" height="28" rx="14" fill="#02110a" stroke="#14402c"/><text x="58" y="18.5" text-anchor="middle" font-family="${MONO}" font-size="10.5" letter-spacing="1.6" fill="${GREEN}">${label}</text></g>`;
    })
    .join("\n  ")}

  <!-- footer line -->
  <line x1="58" y1="348" x2="1142" y2="348" stroke="#0d2c1e"/>
  <text x="58" y="370" font-family="${MONO}" font-size="11" letter-spacing="2.4" fill="#2f5544">SYSTEMS ONLINE</text>
  <circle cx="196" cy="366" r="3.4" fill="${GREEN}"><animate attributeName="opacity" values="1;0.15;1" dur="1.8s" repeatCount="indefinite"/></circle>
  <text x="1142" y="370" text-anchor="end" font-family="${MONO}" font-size="11" letter-spacing="2.4" fill="#2f5544">DHAKA · BD · UTC+06:00</text>

  <!-- scan sweep -->
  <rect x="-400" y="42" width="300" height="350" fill="${GREEN}" opacity="0.02" transform="skewX(-20)">
    <animate attributeName="x" values="-400;1300" dur="9s" repeatCount="indefinite"/>
  </rect>
</svg>
`;
}

/* ---------------------------------------------------------- section header */
function section(num, title, tag) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="70" viewBox="0 0 1200 70" role="img" aria-label="${title}">
  <rect width="1200" height="70" fill="#000000"/>
  <rect y="69" width="1200" height="1" fill="#0d2c1e"/>
  <g transform="translate(10 14)">
    <path d="M 0 0 L 0 24 L 8 24" stroke="${GREEN}" stroke-width="2" fill="none"/>
  </g>
  <text x="32" y="32" font-family="${MONO}" font-size="12" letter-spacing="3" fill="#2f5544">${num}</text>
  <text x="72" y="34" font-family="${SANS}" font-size="24" font-weight="700" letter-spacing="5" fill="${WHITE}">${title}</text>
  <line x1="${120 + title.length * 18}" y1="30" x2="1090" y2="30" stroke="#123a27" stroke-width="1"/>
  <text x="1120" y="34" font-family="${MONO}" font-size="10.5" letter-spacing="2.6" fill="#2f5544">${tag}</text>
  <circle cx="1108" cy="30" r="2.6" fill="${GREEN}"/>
</svg>
`;
}

/* ------------------------------------------------------------------ footer */
function footer() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="120" viewBox="0 0 1200 120" role="img" aria-label="Stay sharp. Ship fast. Break nothing.">
  ${defs("foot")}
  <rect width="1200" height="120" fill="#000000"/>
  <rect width="1200" height="120" fill="url(#grid-foot)"/>
  <ellipse cx="600" cy="120" rx="600" ry="120" fill="url(#glow-foot)"/>
  <line x1="0" y1="1" x2="1200" y2="1" stroke="#0d2c1e"/>
  <text x="600" y="46" text-anchor="middle" font-family="${MONO}" font-size="15" letter-spacing="7" fill="${GREEN}">STAY SHARP · SHIP FAST · BREAK NOTHING</text>
  <text x="600" y="78" text-anchor="middle" font-family="${MONO}" font-size="11" letter-spacing="2.6" fill="#3f6b56">A.K.M TANZIR AHMED · DEVOPS · DHAKA, BANGLADESH · BST UTC+06:00</text>
  <text x="600" y="100" text-anchor="middle" font-family="${MONO}" font-size="10.5" letter-spacing="2.2" fill="#2f5544">$ echo "thanks for stopping by" &amp;&amp; exit 0</text>
</svg>
`;
}

/* -------------------------------------------------------------------- write */
const files = {
  "hero.svg": hero(),
  "sec-about.svg": section("// 01", "ABOUT", "WHOAMI"),
  "sec-stack.svg": section("// 02", "ARSENAL", "STACK"),
  "sec-telemetry.svg": section("// 03", "TELEMETRY", "LIVE"),
  "sec-projects.svg": section("// 04", "PROJECTS", "SHIPPED"),
  "sec-support.svg": section("// 05", "SUPPORT", "FUEL"),
  "footer.svg": footer(),
};

for (const [name, content] of Object.entries(files)) {
  writeFileSync(join(outDir, name), content, "utf8");
  console.log(`wrote assets/${name}`);
}
