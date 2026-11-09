#!/usr/bin/env node
/**
 * Generates assets/time.json for the text-based Dhaka time badge.
 *
 * {"time":"3:50 PM","date":"MONDAY 09 NOVEMBER 2026"}
 *
 * The badge in README reads this file via shields.io dynamic JSON,
 * so the time is always live Dhaka time (UTC+06:00, no DST).
 *
 * Usage: node scripts/time-badge.mjs > assets/time.json
 */
import { writeFileSync } from "node:fs";

const now = new Date(Date.now() + 6 * 3600 * 1000); // BST = UTC+06:00
const h24 = now.getUTCHours();
const minute = now.getUTCMinutes();
const h12 = ((h24 + 11) % 12) + 1;
const meridiem = h24 < 12 ? "AM" : "PM";

const MONTHS = [
  "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
  "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER",
];
const DAYS = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

const payload = {
  time: `${h12}:${String(minute).padStart(2, "0")} ${meridiem}`,
  date: `${DAYS[now.getUTCDay()]} ${String(now.getUTCDate()).padStart(2, "0")} ${MONTHS[now.getUTCMonth()]} ${now.getUTCFullYear()}`,
};

writeFileSync(process.argv[2] || "assets/time.json", JSON.stringify(payload) + "\n");
console.log(JSON.stringify(payload));
