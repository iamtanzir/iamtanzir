#!/usr/bin/env node
/**
 * Builds the two telemetry cards used by the profile README:
 *   out/stats.svg   — repositories, stars, followers, forks, contributions
 *   out/langs.svg   — top languages (by bytes when a token is available)
 *
 * Reads GITHUB_TOKEN from the environment when present. Runs locally without
 * a token too (falls back to primary-language counts and skips contributions).
 *
 * Usage: node scripts/metrics.mjs [outDir]
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const USER = "iamtanzir";
const outDir = process.argv[2] || "out";
mkdirSync(outDir, { recursive: true });

const TOKEN = process.env.GITHUB_TOKEN || "";
const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "iamtanzir-profile-metrics",
  ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
};

const GREEN = "#00ff88";
const GREY = "#5d8573";
const WHITE = "#e9fff5";
const MONO = "'JetBrains Mono',Consolas,'Courier New',monospace";
const CARD_W = 460;
const CARD_H = 196;

const api = async (url) => {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return res.json();
};

/* ------------------------------------------------------------------- gather */
const user = await api(`https://api.github.com/users/${USER}`);
const repos = await api(`https://api.github.com/users/${USER}/repos?per_page=100&type=owner&sort=updated`);

const owned = repos.filter((r) => !r.fork);
const stats = repos.reduce(
  (acc, r) => {
    acc.stars += r.stargazers_count || 0;
    acc.forks += r.forks_count || 0;
    return acc;
  },
  { stars: 0, forks: 0 },
);
const stars = stats.stars;
const forks = stats.forks;

let languageData = null;
if (TOKEN) {
  const totals = new Map();
  const targets = owned.slice(0, 100);
  for (let i = 0; i < targets.length; i += 8) {
    const chunk = targets.slice(i, i + 8);
    const results = await Promise.allSettled(
      chunk.map((r) => api(`https://api.github.com/repos/${USER}/${r.name}/languages`)),
    );
    for (const result of results) {
      if (result.status !== "fulfilled") continue;
      for (const [lang, bytes] of Object.entries(result.value)) {
        totals.set(lang, (totals.get(lang) || 0) + bytes);
      }
    }
  }
  if (totals.size) {
    languageData = [...totals.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, bytes]) => ({ name, weight: bytes }));
  }
}
if (!languageData) {
  const counts = new Map();
  for (const r of owned) if (r.language) counts.set(r.language, (counts.get(r.language) || 0) + 1);
  languageData = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, n]) => ({ name, weight: n }));
}

let contributions = null;
if (TOKEN) {
  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `query($login:String!){user(login:$login){contributionsCollection{contributionCalendar{totalContributions}}}}`,
        variables: { login: USER },
      }),
    });
    const json = await res.json();
    contributions = json?.data?.user?.contributionsCollection?.contributionCalendar?.totalContributions ?? null;
  } catch {
    contributions = null;
  }
}

const years = Math.max(1, new Date().getFullYear() - new Date(user.created_at).getFullYear());

/* ------------------------------------------------------------------ helpers */
const frame = (title, tag, body, width = CARD_W, height = CARD_H) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${title}">
  <defs>
    <pattern id="g" width="24" height="24" patternUnits="userSpaceOnUse">
      <path d="M 24 0 L 0 0 0 24" fill="none" stroke="${GREEN}" stroke-width="0.6" opacity="0.05"/>
    </pattern>
    <radialGradient id="glow" cx="50%" cy="0%" r="90%">
      <stop offset="0%" stop-color="${GREEN}" stop-opacity="0.13"/>
      <stop offset="100%" stop-color="${GREEN}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${width}" height="${height}" rx="14" fill="#000000"/>
  <rect width="${width}" height="${height}" rx="14" fill="url(#g)"/>
  <rect width="${width}" height="${height}" rx="14" fill="url(#glow)"/>
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="14" fill="none" stroke="#123a27" stroke-width="1.3"/>
  <path d="M 14 34 L 14 14 L 34 14" stroke="${GREEN}" stroke-width="2" fill="none"/>
  <text x="48" y="34" font-family="${MONO}" font-size="13" font-weight="700" letter-spacing="3.4" fill="${GREEN}">${title}</text>
  <text x="${width - 16}" y="32" text-anchor="end" font-family="${MONO}" font-size="9.5" letter-spacing="2.2" fill="#33604c">${tag}</text>
  <line x1="16" y1="48" x2="${width - 16}" y2="48" stroke="#0f3323"/>
  ${body}
</svg>
`;

const metric = (x, y, label, value) => `
  <text x="${x}" y="${y}" font-family="${MONO}" font-size="10.5" letter-spacing="2.4" fill="${GREY}">${label}</text>
  <text x="${x}" y="${y + 30}" font-family="${MONO}" font-size="30" font-weight="700" fill="${WHITE}">${value}</text>`;

/* ------------------------------------------------------------------ stats */
const statsBody = `
  ${metric(24, 78, "REPOSITORIES", user.public_repos)}
  ${metric(178, 78, "STARS", stars)}
  ${metric(296, 78, "FOLLOWERS", user.followers)}
  ${metric(24, 142, "FORKS", forks)}
  ${metric(178, 142, "CONTRIBUTIONS", contributions === null ? "—" : contributions)}
  ${metric(296, 142, "YEARS", `${years}+`)}
  <text x="${CARD_W - 16}" y="${CARD_H - 14}" text-anchor="end" font-family="${MONO}" font-size="9" letter-spacing="1.8" fill="#33604c">SYNCED ${new Date().toISOString().slice(0, 10)}</text>`;

const statsSvg = frame("GITHUB TELEMETRY", "LIVE API", statsBody);

/* -------------------------------------------------------------- languages */
const maxWeight = Math.max(...languageData.map((l) => l.weight), 1);
const totalWeight = languageData.reduce((n, l) => n + l.weight, 0) || 1;
const langRows = languageData
  .map((lang, i) => {
    const y = 74 + i * 20;
    const pct = Math.max(3, Math.round((lang.weight / totalWeight) * 100));
    const bar = Math.max(14, Math.round((lang.weight / maxWeight) * 236));
    return `
      <text x="24" y="${y}" font-family="${MONO}" font-size="11.5" letter-spacing="1" fill="${WHITE}">${lang.name.toUpperCase()}</text>
      <text x="${CARD_W - 16}" y="${y}" text-anchor="end" font-family="${MONO}" font-size="10.5" fill="${GREY}">${pct}%</text>
      <rect x="170" y="${y - 8}" width="236" height="6" rx="3" fill="#0d2a1d"/>
      <rect x="170" y="${y - 8}" width="${bar}" height="6" rx="3" fill="${GREEN}" opacity="${(1 - i * 0.13).toFixed(2)}"/>`;
  })
  .join("");

const langsBody = `
  ${langRows}
  <text x="24" y="${CARD_H - 16}" font-family="${MONO}" font-size="9.5" letter-spacing="2" fill="#33604c">SOURCE: GITHUB API · ${TOKEN ? "BYTES" : "PRIMARY LANG"}</text>`;

const langsSvg = frame("TOP LANGUAGES", "COMPILED", langsBody);

writeFileSync(join(outDir, "stats.svg"), statsSvg, "utf8");
writeFileSync(join(outDir, "langs.svg"), langsSvg, "utf8");
console.log(`wrote ${outDir}/stats.svg and ${outDir}/langs.svg`);
