import { DigitalSvgClock } from 'digital-svg-clock';
import fs from 'fs';

// ঢাকার বর্তমান সময় বের করা (UTC+6)
const now = new Date();
const dhakaTime = new Date(now.getTime() + (6 * 60 * 60 * 1000));

// ঘড়ি তৈরি
const clock = new DigitalSvgClock({
  clockFormat: "24h",
  startTime: dhakaTime,
  textColor: "#00FF88",
  textFontSize: 60,
  textFontFamily: "'Courier New', Courier, monospace",
  textFontWeight: "bold",
  useJavascript: false,
  width: 300,
  height: 100
});

const svg = clock.render();
fs.writeFileSync('digital-clock.svg', svg);
console.log('✅ Digital Clock SVG generated successfully!');
