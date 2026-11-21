// Cloudflare Worker: live Dhaka clock SVG (exact SMIL seven-segment design)
// Each request renders the current time from time.now API into the same SMIL
// clock style you use in assets/bd-clock.svg, so the time is always live.
//
// Deploy: wrangler deploy cloudflare-worker.js --name live-clock
// Then set README img src to: https://live-clock.<your-subdomain>.workers.dev

const SEGMENTS = {
  a: "12,6 48,6 42,12 18,12",
  b: "48,6 54,12 54,48 48,54 42,48 42,12",
  c: "54,54 54,90 48,96 42,90 42,54 48,48",
  d: "18,96 42,96 48,90 42,84 18,84 12,90",
  e: "6,54 12,48 18,54 18,90 12,96 6,90",
  f: "6,12 12,6 18,12 18,48 12,54 6,48",
  g: "18,48 42,48 48,54 42,60 18,60 12,54",
};
const DIGITS = {
  0: "abcdef", 1: "bc", 2: "abged", 3: "abgcd", 4: "fgbc",
  5: "afgcd", 6: "afgecd", 7: "abc", 8: "abcdefg", 9: "abcdfg",
};
const ON = "#00ff41", OFF = "#002b0d";
const SLOT_X = [10, 70, 160, 220, 310, 370];

export default {
  async fetch() {
    let h24, minute, second;
    try {
      const r = await fetch("https://time.now/developer/api/time?timezone=Asia%2FDhaka");
      const d = await r.json();
      const m = d.datetime.match(/T(\d{2}):(\d{2}):(\d{2})/);
      h24 = +m[1]; minute = +m[2]; second = +m[3];
    } catch {
      const t = new Date(Date.now() + 6 * 3600 * 1000);
      h24 = t.getUTCHours(); minute = t.getUTCMinutes(); second = t.getUTCSeconds();
    }
    const isPM = h24 >= 12;
    const h12 = ((h24 + 11) % 12) + 1;

    const sub = minute * 60 + second;
    const slots = [
      { seq: Array.from({ length: 12 }, (_, i) => Math.floor(((i + 1) / 10) % 10)), dur: 43200, phase: (h12 - 1) * 3600 + sub },
      { seq: Array.from({ length: 12 }, (_, i) => (i + 1) % 10), dur: 43200, phase: (h12 - 1) * 3600 + sub },
      { seq: [0, 1, 2, 3, 4, 5], dur: 3600, phase: sub },
      { seq: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], dur: 600, phase: (minute % 10) * 60 + second },
      { seq: [0, 1, 2, 3, 4, 5], dur: 60, phase: second },
      { seq: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], dur: 10, phase: second },
    ];

    const clockGroup = SLOT_X.map((x, i) => {
      const { seq, dur, phase } = slots[i];
      const n = seq.length;
      const keyTimes = Array.from({ length: n + 1 }, (_, k) => (k / n).toFixed(6)).join(";");
      const polys = Object.entries(SEGMENTS).map(([key, points]) => {
        const flags = seq.map((d) => (DIGITS[d].includes(key) ? "1" : "0"));
        const values = flags.concat(flags[flags.length - 1]).join(";");
        return `<polygon points="${points}" fill="${OFF}"/>` +
          `<polygon points="${points}" fill="${ON}" filter="url(#glow)">` +
          `<animate attributeName="opacity" values="${values}" keyTimes="${keyTimes}" dur="${dur}s" begin="-${phase.toFixed(2)}s" calcMode="discrete" repeatCount="indefinite"/>` +
          `</polygon>`;
      }).join("");
      return `<g transform="translate(${x}, 10)">${polys}</g>`;
    }).join("");

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 120" width="480" height="120">
  <defs>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
    </filter>
    <pattern id="pixels" width="4" height="4" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.2" fill="#000000" fill-opacity="0.75" />
    </pattern>
  </defs>
  <rect width="480" height="120" fill="#001a08" />
  <circle cx="135" cy="35" r="5" fill="${ON}" filter="url(#glow)" />
  <circle cx="135" cy="75" r="5" fill="${ON}" filter="url(#glow)" />
  <circle cx="285" cy="35" r="5" fill="${ON}" filter="url(#glow)" />
  <circle cx="285" cy="75" r="5" fill="${ON}" filter="url(#glow)" />
  ${clockGroup}
  <rect width="480" height="120" fill="url(#pixels)" pointer-events="none" />
  <text x="440" y="40" fill="${isPM ? OFF : ON}" font-family="monospace" font-size="14" font-weight="bold"${!isPM ? ' filter="url(#glow)"' : ""}>AM</text>
  <text x="440" y="75" fill="${isPM ? ON : OFF}" font-family="monospace" font-size="14" font-weight="bold"${isPM ? ' filter="url(#glow)"' : ""}>PM</text>
</svg>`;

    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Access-Control-Allow-Origin": "*",
      },
    });
  },
};
