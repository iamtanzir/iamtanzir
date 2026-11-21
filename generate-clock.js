const { DigitalSvgClock } = require('digital-svg-clock');
const fs = require('fs');

// ঢাকার বর্তমান সময় বের করা (UTC+6)
const now = new Date();
const dhakaTime = new Date(now.getTime() + (6 * 60 * 60 * 1000));

// ওপেন সোর্স প্যাকেজ ব্যবহার করে ঘড়ি তৈরি (ডার্ক থিম ও সবুজ ফন্ট)
const clock = new DigitalSvgClock({
  clockFormat: "24h",
  startTime: dhakaTime,
  textColor: "#00FF88", // আপনার পছন্দের সবুজ রঙ
  textFontSize: 60,
  textFontFamily: "'Courier New', Courier, monospace",
  textFontWeight: "bold",
  useJavascript: false, // SMIL অ্যানিমেশন ব্যবহার করবে, যা GitHub সাপোর্ট করে
  width: 300,
  height: 100
});

const svg = clock.render();
fs.writeFileSync('digital-clock.svg', svg);
console.log('✅ Digital Clock SVG generated successfully!');
