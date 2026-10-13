/**
 * DiagramGenerator - Generates crisp 2D SVG/Canvas diagrams for Rubik's Cube cases
 * High-resolution, zero external dependencies.
 */

import { COLORS } from './cube-engine.js';

export class DiagramGenerator {
  /**
   * Generates an SVG string for a Last Layer (OLL / 2-Look) recognition diagram.
   * @param {Object} config - { top: Array(9), rims: { B: [3], F: [3], L: [3], R: [3] } }
   * top[i]: 1 for yellow, 0 for unoriented
   * rims: 1 if yellow sticker faces that side, 0 otherwise
   */
  static renderOLLSVG(config, size = 100) {
    const { top = [0,0,0,0,1,0,0,0,0], rims = {} } = config;
    const pad = 12;
    const cubeSize = size - pad * 2;
    const cellSize = cubeSize / 3;
    const rimThick = 6;

    let svg = `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">`;
    svg += `<rect width="${size}" height="${size}" fill="#0f172a" rx="8"/>`;

    // Draw Rims (B on top, F on bottom, L on left, R on right)
    const bRims = rims.B || [0, 0, 0];
    const fRims = rims.F || [0, 0, 0];
    const lRims = rims.L || [0, 0, 0];
    const rRims = rims.R || [0, 0, 0];

    // B Rim (top)
    bRims.forEach((val, c) => {
      const fill = val ? COLORS.U : '#334155';
      const x = pad + c * cellSize + 1;
      const y = pad - rimThick - 2;
      svg += `<rect x="${x}" y="${y}" width="${cellSize - 2}" height="${rimThick}" fill="${fill}" rx="2"/>`;
    });

    // F Rim (bottom)
    fRims.forEach((val, c) => {
      const fill = val ? COLORS.U : '#334155';
      const x = pad + c * cellSize + 1;
      const y = pad + cubeSize + 2;
      svg += `<rect x="${x}" y="${y}" width="${cellSize - 2}" height="${rimThick}" fill="${fill}" rx="2"/>`;
    });

    // L Rim (left)
    lRims.forEach((val, r) => {
      const fill = val ? COLORS.U : '#334155';
      const x = pad - rimThick - 2;
      const y = pad + r * cellSize + 1;
      svg += `<rect x="${x}" y="${y}" width="${rimThick}" height="${cellSize - 2}" fill="${fill}" rx="2"/>`;
    });

    // R Rim (right)
    rRims.forEach((val, r) => {
      const fill = val ? COLORS.U : '#334155';
      const x = pad + cubeSize + 2;
      const y = pad + r * cellSize + 1;
      svg += `<rect x="${x}" y="${y}" width="${rimThick}" height="${cellSize - 2}" fill="${fill}" rx="2"/>`;
    });

    // Draw 9 Top Facelets
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const idx = r * 3 + c;
        const isYellow = (top[idx] === 1) || (idx === 4); // Center is always yellow
        const fill = isYellow ? COLORS.U : '#1e293b';
        const stroke = '#0f172a';
        const x = pad + c * cellSize + 1;
        const y = pad + r * cellSize + 1;
        svg += `<rect x="${x}" y="${y}" width="${cellSize - 2}" height="${cellSize - 2}" fill="${fill}" stroke="${stroke}" stroke-width="1.5" rx="3"/>`;
      }
    }

    svg += `</svg>`;
    return svg;
  }

  /**
   * Generates an SVG string for PLL recognition (All top yellow, arrows or rim headlights showing cycle).
   * @param {Object} config - { arrows: Array of [fromX, fromY, toX, toY], headlights: 'left'|'right'|'front'|'back' }
   */
  static renderPLLSVG(config, size = 100) {
    const pad = 12;
    const cubeSize = size - pad * 2;
    const cellSize = cubeSize / 3;
    const rimThick = 6;

    let svg = `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">`;
    svg += `<defs>
      <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="4" refY="2" orient="auto">
        <polygon points="0 0, 6 2, 0 4" fill="#38bdf8" />
      </marker>
      <marker id="arrowhead-red" markerWidth="6" markerHeight="4" refX="4" refY="2" orient="auto">
        <polygon points="0 0, 6 2, 0 4" fill="#f43f5e" />
      </marker>
    </defs>`;
    svg += `<rect width="${size}" height="${size}" fill="#0f172a" rx="8"/>`;

    // Draw 9 Yellow Top Facelets
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const x = pad + c * cellSize + 1;
        const y = pad + r * cellSize + 1;
        svg += `<rect x="${x}" y="${y}" width="${cellSize - 2}" height="${cellSize - 2}" fill="${COLORS.U}" stroke="#0f172a" stroke-width="1.5" rx="3"/>`;
      }
    }

    // Draw Rim Stickers if provided (color codes)
    if (config.rimColors) {
      const { B = [], F = [], L = [], R = [] } = config.rimColors;
      B.forEach((color, c) => {
        svg += `<rect x="${pad + c * cellSize + 1}" y="${pad - rimThick - 2}" width="${cellSize - 2}" height="${rimThick}" fill="${color}" rx="2"/>`;
      });
      F.forEach((color, c) => {
        svg += `<rect x="${pad + c * cellSize + 1}" y="${pad + cubeSize + 2}" width="${cellSize - 2}" height="${rimThick}" fill="${color}" rx="2"/>`;
      });
      L.forEach((color, r) => {
        svg += `<rect x="${pad - rimThick - 2}" y="${pad + r * cellSize + 1}" width="${rimThick}" height="${cellSize - 2}" fill="${color}" rx="2"/>`;
      });
      R.forEach((color, r) => {
        svg += `<rect x="${pad + cubeSize + 2}" y="${pad + r * cellSize + 1}" width="${rimThick}" height="${cellSize - 2}" fill="${color}" rx="2"/>`;
      });
    }

    // Draw Cycle Arrows
    const arrowsList = config.arrows || config.pllArrows;
    if (arrowsList && Array.isArray(arrowsList)) {
      arrowsList.forEach(([fromR, fromC, toR, toC, color = '#38bdf8']) => {
        const x1 = pad + fromC * cellSize + cellSize / 2;
        const y1 = pad + fromR * cellSize + cellSize / 2;
        const x2 = pad + toC * cellSize + cellSize / 2;
        const y2 = pad + toR * cellSize + cellSize / 2;
        const marker = color === '#f43f5e' ? 'arrowhead-red' : 'arrowhead';

        svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="2.5" marker-end="url(#${marker})" stroke-linecap="round"/>`;
      });
    }

    svg += `</svg>`;
    return svg;
  }

  /**
   * Generates a flat 2D net diagram of a full cube state (used for scramble verification).
   * Unfolded T-shape:
   *        [ U ]
   *    [ L ][ F ][ R ][ B ]
   *        [ D ]
   */
  static renderFlatNet(cubeState, width = 240, height = 180) {
    const cellSize = Math.floor(Math.min(width / 12, height / 9));
    const startX = Math.floor((width - cellSize * 12) / 2);
    const startY = Math.floor((height - cellSize * 9) / 2);

    let svg = `<svg viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
    svg += `<rect width="${width}" height="${height}" fill="#090d16" rx="6"/>`;

    const faceOffsets = {
      U: [3, 0],
      L: [0, 3],
      F: [3, 3],
      R: [6, 3],
      B: [9, 3],
      D: [3, 6]
    };

    const faces = cubeState.faces;

    for (const [faceName, [ox, oy]] of Object.entries(faceOffsets)) {
      const stickerArray = faces[faceName];
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          const idx = r * 3 + c;
          const colorKey = stickerArray[idx];
          const fillColor = COLORS[colorKey] || '#475569';
          const x = startX + (ox + c) * cellSize;
          const y = startY + (oy + r) * cellSize;

          svg += `<rect x="${x + 0.5}" y="${y + 0.5}" width="${cellSize - 1}" height="${cellSize - 1}" fill="${fillColor}" stroke="#0f172a" stroke-width="0.8" rx="1.5"/>`;
        }
      }
    }

    svg += `</svg>`;
    return svg;
  }
}
