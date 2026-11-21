// scripts/clock.mjs
const now = new Date();
// ঢাকার সময় বের করা (UTC+6)
const dhakaTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Dhaka"}));

let hours = dhakaTime.getHours();
const minutes = dhakaTime.getMinutes();
const seconds = dhakaTime.getSeconds();
const isPM = hours >= 12;

// 12-ঘণ্টা ফরম্যাটে রূপান্তর
hours = hours % 12 || 12;

// ৭-সেগমেন্ট ডিজিটের পয়েন্ট
const segs = {
  A: "12,6 48,6 42,12 18,12",
  B: "48,6 54,12 54,48 48,54 42,48 42,12",
  C: "54,54 54,90 48,96 42,90 42,54 48,48",
  D: "18,96 42,96 48,90 42,84 18,84 12,90",
  E: "6,54 12,48 18,54 18,90 12,96 6,90",
  F: "6,12 12,6 18,12 18,48 12,54 6,48",
  G: "18,48 42,48 48,54 42,60 18,60 12,54"
};

const activeSegs = {
  0: ['A','B','C','D','E','F'], 1: ['B','C'], 2: ['A','B','G','E','D'],
  3: ['A','B','G','C','D'], 4: ['F','G','B','C'], 5: ['A','F','G','C','D'],
  6: ['A','F','G','E','C','D'], 7: ['A','B','C'], 8: ['A','B','C','D','E','F','G'], 9: ['A','B','C','D','F','G']
};

function getDigitSVG(num, x, y, isAnimating = false, animType = '', beginTime = 0) {
  let svg = `<g transform="translate(${x}, ${y})">`;
  for (const [key, points] of Object.entries(segs)) {
    const isActive = activeSegs[num].includes(key);
    const color = isActive ? "#00ff41" : "#002b0d"; // সবুজ এবং ডার্ক গ্রিন
    svg += `<polygon points="${points}" fill="${color}" ${isActive ? 'filter="url(#glow)"' : ''} />`;
  }
  svg += `</g>`;
  
  if (isAnimating) {
    let anim = `<animate attributeName="opacity" dur="${animType}" repeatCount="indefinite" begin="-${beginTime}s" values="`;
    if (animType === '10s') {
      anim += Array.from({length: 10}, (_, i) => i === num ? '1' : '0').join(';');
      anim += `" keyTimes="0;0.1;0.2;0.3;0.4;0.5;0.6;0.7;0.8;0.9" />`;
    } else if (animType === '60s') {
      anim += Array.from({length: 6}, (_, i) => i === num ? '1' : '0').join(';');
      anim += `" keyTimes="0;0.166;0.333;0.5;0.666;0.833" />`;
    }
    svg = svg.replace('<g ', `<g `).replace('</g>', `${anim}</g>`);
  }
  return svg;
}

const h1 = Math.floor(hours / 10);
const h2 = hours % 10;
const m1 = Math.floor(minutes / 10);
const m2 = minutes % 10;
const s1 = Math.floor(seconds / 10);
const s2 = seconds % 10;

// Y-অক্ষ (উচ্চতা) ৮০ থেকে কমিয়ে ২০ করা হয়েছে যাতে এটি মিনি দেখায়
let clockGroup = '';
clockGroup += getDigitSVG(h1, 100, 20);
clockGroup += getDigitSVG(h2, 180, 20);
clockGroup += `<circle cx="260" cy="40" r="6" fill="#00ff41" filter="url(#glow)"/>`;
clockGroup += `<circle cx="260" cy="80" r="6" fill="#00ff41" filter="url(#glow)"/>`;
clockGroup += getDigitSVG(m1, 300, 20);
clockGroup += getDigitSVG(m2, 380, 20);
clockGroup += `<circle cx="460" cy="40" r="6" fill="#00ff41" filter="url(#glow)"/>`;
clockGroup += `<circle cx="460" cy="80" r="6" fill="#00ff41" filter="url(#glow)"/>`;

// সেকেন্ডের জন্য SMIL অ্যানিমেশন
for (let i = 0; i <= 5; i++) {
  clockGroup += getDigitSVG(i, 500, 20, true, '60s', seconds);
}
for (let i = 0; i <= 9; i++) {
  clockGroup += getDigitSVG(i, 580, 20, true, '10s', seconds);
}

// ব্যাকগ্রাউন্ড এবং বর্ডার ছাড়া শুধুমাত্র SVG
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 120" width="100%" height="100%">
  <defs>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
  
  <!-- Clock Digits -->
  ${clockGroup}

  <!-- AM / PM Indicator -->
  <text x="680" y="55" fill="${isPM ? '#002b0d' : '#00ff41'}" font-family="monospace" font-size="16" font-weight="bold" ${!isPM ? 'filter="url(#glow)"' : ''}>AM</text>
  <text x="680" y="95" fill="${isPM ? '#00ff41' : '#002b0d'}" font-family="monospace" font-size="16" font-weight="bold" ${isPM ? 'filter="url(#glow)"' : ''}>PM</text>
</svg>
`;

process.stdout.write(svg);
