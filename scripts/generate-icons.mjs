/**
 * Generates icon-192.png and icon-512.png using only Node.js built-ins.
 * No npm packages required — works on Termux / Android ARM64.
 *
 * Usage:
 *   node scripts/generate-icons.mjs
 */

import zlib from 'zlib';
import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'public', 'icons');
fs.mkdirSync(outDir, { recursive: true });

// ── Minimal PNG encoder ───────────────────────────────────────────────────────
function u32(n) {
  return [(n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff];
}

function crc32(buf) {
  let c = 0xffffffff;
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let x = i;
    for (let j = 0; j < 8; j++) x = x & 1 ? 0xedb88320 ^ (x >>> 1) : x >>> 1;
    t[i] = x;
  }
  for (const b of buf) c = t[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const t = [...type].map(c => c.charCodeAt(0));
  const d = Array.from(data);
  return [...u32(d.length), ...t, ...d, ...u32(crc32(new Uint8Array([...t, ...d])))];
}

function encodePNG(w, h, rgba) {
  const raw = [];
  for (let y = 0; y < h; y++) {
    raw.push(0);                          // filter byte: None
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      raw.push(rgba[i], rgba[i+1], rgba[i+2], rgba[i+3]);
    }
  }
  const deflated = Array.from(zlib.deflateSync(Buffer.from(raw)));
  return Buffer.from([
    137, 80, 78, 71, 13, 10, 26, 10,     // PNG signature
    ...chunk('IHDR', [...u32(w), ...u32(h), 8, 6, 0, 0, 0]),
    ...chunk('IDAT', deflated),
    ...chunk('IEND', []),
  ]);
}

// ── Gold gradient helper (top-left → bottom-right) ───────────────────────────
// #F0D080 → #C9A84C → #A0762A
function goldGradient(t) {
  // t: 0..1
  if (t < 0.5) {
    const u = t / 0.5;
    return [
      Math.round(0xF0 + (0xC9 - 0xF0) * u),
      Math.round(0xD0 + (0xA8 - 0xD0) * u),
      Math.round(0x80 + (0x4C - 0x80) * u),
    ];
  } else {
    const u = (t - 0.5) / 0.5;
    return [
      Math.round(0xC9 + (0xA0 - 0xC9) * u),
      Math.round(0xA8 + (0x76 - 0xA8) * u),
      Math.round(0x4C + (0x2A - 0x4C) * u),
    ];
  }
}

// ── Draw icon into a raw RGBA buffer ─────────────────────────────────────────
function generateIcon(size) {
  const rgba = new Uint8Array(size * size * 4);
  const cx = size / 2, cy = size / 2;

  // Rounded rect radius (28% → matches SVG rx="18" on 64px viewBox)
  const cornerR = size * 0.28;

  // Inner decorative ring
  const ringR     = size * 0.36;
  const ringW     = size * 0.012;

  // Check mark points scaled from 64px grid: M20 33 L29 42 L45 23
  const s  = size / 64;
  const p0 = { x: 20 * s, y: 33 * s };
  const p1 = { x: 29 * s, y: 42 * s };
  const p2 = { x: 45 * s, y: 23 * s };
  const checkW = size * 0.038;  // half-stroke width

  function distSeg(px, py, ax, ay, bx, by) {
    const dx = bx - ax, dy = by - ay;
    const t  = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx*dx + dy*dy)));
    return Math.hypot(px - ax - t*dx, py - ay - t*dy);
  }

  function inRoundedRect(x, y) {
    const lx = Math.min(x, size - 1 - x);
    const ly = Math.min(y, size - 1 - y);
    if (lx >= cornerR || ly >= cornerR) return true;
    return Math.hypot(cornerR - lx, cornerR - ly) <= cornerR;
  }

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;

      if (!inRoundedRect(x, y)) {
        rgba[idx + 3] = 0;  // transparent outside rounded rect
        continue;
      }

      // Gold gradient fill (diagonal t)
      const t  = (x + y) / (size * 2 - 2);
      const [r, g, b] = goldGradient(t);
      rgba[idx]   = r;
      rgba[idx+1] = g;
      rgba[idx+2] = b;
      rgba[idx+3] = 255;

      // Inner ring overlay (18% white)
      const d = Math.hypot(x - cx, y - cy);
      if (Math.abs(d - ringR) < ringW) {
        rgba[idx]   = Math.round(r + (255 - r) * 0.18);
        rgba[idx+1] = Math.round(g + (255 - g) * 0.18);
        rgba[idx+2] = Math.round(b + (255 - b) * 0.18);
      }

      // Check mark (white)
      const d1 = distSeg(x, y, p0.x, p0.y, p1.x, p1.y);
      const d2 = distSeg(x, y, p1.x, p1.y, p2.x, p2.y);
      if (d1 < checkW || d2 < checkW) {
        rgba[idx]   = 255;
        rgba[idx+1] = 255;
        rgba[idx+2] = 255;
        rgba[idx+3] = 255;
      }
    }
  }

  return encodePNG(size, size, rgba);
}

// ── Write files ───────────────────────────────────────────────────────────────
for (const size of [192, 512]) {
  const buf  = generateIcon(size);
  const dest = path.join(outDir, `icon-${size}.png`);
  fs.writeFileSync(dest, buf);
  console.log(`✓ Generated ${dest} (${buf.length} bytes)`);
}

console.log('\nDone. Icons match AppLogo gold gradient.');