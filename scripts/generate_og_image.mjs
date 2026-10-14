import fs from 'node:fs';
import zlib from 'node:zlib';

function createPNG(width, height, drawFn) {
  const buffer = Buffer.alloc(height * (width * 4 + 1));
  let pos = 0;
  for (let y = 0; y < height; y++) {
    buffer[pos++] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = drawFn(x, y, width, height);
      buffer[pos++] = r;
      buffer[pos++] = g;
      buffer[pos++] = b;
      buffer[pos++] = a;
    }
  }

  const compressed = zlib.deflateSync(buffer);

  function crc32(buf) {
    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      let byte = buf[i];
      for (let j = 0; j < 8; j++) {
        const bit = (crc ^ byte) & 1;
        crc = (crc >>> 1) ^ (bit ? 0xedb88320 : 0);
        byte >>>= 1;
      }
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    const checksum = crc32(Buffer.concat([typeBuf, data]));
    crcBuf.writeUInt32BE(checksum, 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

function ogDrawer(x, y, w, h) {
  // Background gradient: dark sleek slate (#070a12 to #0f172a)
  const normY = y / h;
  const normX = x / w;

  let r = Math.round(7 + normY * 12);
  let g = Math.round(10 + normY * 16);
  let b = Math.round(18 + normY * 28);
  let a = 255;

  // Ambient radial glow behind cube on left (cyan glow around x: 340, y: 315)
  const distGlow = Math.hypot(x - 340, y - 315);
  if (distGlow < 350) {
    const factor = (1 - distGlow / 350) ** 2;
    r = Math.min(255, Math.round(r + 2 * factor * 40));
    g = Math.min(255, Math.round(g + 132 * factor * 0.7));
    b = Math.min(255, Math.round(b + 199 * factor * 0.9));
  }

  // Draw 3D isometric Rubik's cube centered around (cx: 340, cy: 315)
  const cx = 340;
  const cy = 315;
  const scale = 190;
  const nx = (x - cx) / scale;
  const ny = (y - cy) / scale;

  // Isometric cube geometry
  // Top Face (Yellow)
  const isTop = ny < 0 && Math.abs(nx) < 0.95 && (ny + 0.52 * Math.abs(nx)) < 0.05 && (ny - 0.52 * Math.abs(nx)) > -0.95;
  if (isTop) {
    // Top face sticker grid (3x3)
    const gridX = Math.floor((nx + 0.95) / (1.9 / 3));
    const gridY = Math.floor((ny + 0.95) / (1.0 / 3));
    const isGridLine = Math.abs((nx + 0.95) % (1.9 / 3)) < 0.04 || Math.abs((ny + 0.95) % (1.0 / 3)) < 0.04;
    if (isGridLine) {
      r = 15; g = 23; b = 42;
    } else {
      r = 250; g = 204; b = 21; // Bright Yellow
      if ((gridX + gridY) % 2 === 0) { r = 245; g = 158; b = 11; } // Warm amber
    }
    return [r, g, b, 255];
  }

  // Left Face (Green)
  const isLeft = nx < 0 && ny >= 0 && (ny - 0.52 * nx) < 0.98 && (ny + 0.52 * nx) > -0.05;
  if (isLeft) {
    const isGridLine = Math.abs((nx) % (0.95 / 3)) < 0.03 || Math.abs((ny) % (0.98 / 3)) < 0.03;
    if (isGridLine) {
      r = 15; g = 23; b = 42;
    } else {
      r = 16; g = 185; b = 129; // Emerald green
      if (Math.abs(Math.floor(nx * 3) + Math.floor(ny * 3)) % 2 === 0) { r = 5; g = 150; b = 105; }
    }
    return [r, g, b, 255];
  }

  // Right Face (Red/Orange)
  const isRight = nx >= 0 && ny >= 0 && (ny + 0.52 * nx) < 0.98 && (ny - 0.52 * nx) > -0.05;
  if (isRight) {
    const isGridLine = Math.abs((nx) % (0.95 / 3)) < 0.03 || Math.abs((ny) % (0.98 / 3)) < 0.03;
    if (isGridLine) {
      r = 15; g = 23; b = 42;
    } else {
      r = 244; g = 63; b = 94; // Ruby Red
      if (Math.abs(Math.floor(nx * 3) + Math.floor(ny * 3)) % 2 === 0) { r = 225; g = 29; b = 72; }
    }
    return [r, g, b, 255];
  }

  // Subtle decorative grid lines on the right side
  if (x > 620 && (x % 60 === 0 || y % 60 === 0)) {
    r = Math.min(255, r + 10);
    g = Math.min(255, g + 14);
    b = Math.min(255, b + 22);
  }

  return [r, g, b, a];
}

console.log('Generating 1200x630 Open Graph image...');
const png = createPNG(1200, 630, ogDrawer);
fs.writeFileSync('icons/og-preview.png', png);
console.log('Successfully created icons/og-preview.png (' + (png.length / 1024).toFixed(1) + ' KB)');
