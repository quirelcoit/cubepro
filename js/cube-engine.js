import { FACELETS, getMove } from './cube-moves.js';

export const COLORS = {
  U: '#ffd500', // Yellow (Top)
  D: '#ffffff', // White (Bottom)
  F: '#009b48', // Green (Front)
  B: '#0046ad', // Blue (Back)
  L: '#ff5800', // Orange (Left)
  R: '#b71234'  // Red (Right)
};

export const COLOR_NAMES = {
  U: 'yellow',
  D: 'white',
  F: 'green',
  B: 'blue',
  L: 'orange',
  R: 'red'
};


const key = (position, normal) => [...position, ...normal].join(',');
const destinations = new Map(FACELETS.map(f => [key(f.position, f.normal), f]));

function rotate(vector, axis, angle) {
  const [x, y, z] = vector;
  const c = Math.round(Math.cos(angle)), s = Math.round(Math.sin(angle));
  if (axis === 'x') return [x, y * c - z * s, y * s + z * c];
  if (axis === 'y') return [x * c + z * s, y, -x * s + z * c];
  return [x * c - y * s, x * s + y * c, z];
}

export class Cube {
  constructor() { this.reset(); }

  reset() {
    this.faces = Object.fromEntries(['U', 'D', 'F', 'B', 'L', 'R'].map(f => [f, Array(9).fill(f)]));
  }

  clone() {
    const copy = new Cube();
    for (const face in this.faces) copy.faces[face] = [...this.faces[face]];
    return copy;
  }

  isSolved() {
    for (const f of ['U', 'D', 'F', 'B', 'L', 'R']) {
      const center = this.faces[f][4];
      if (!this.faces[f].every(color => color === center)) return false;
    }
    return true;
  }

  applyMove(move) {
    const { axis, layers, angle } = getMove(move);
    const axisIndex = { x: 0, y: 1, z: 2 }[axis];
    const before = this.clone().faces;
    for (const sticker of FACELETS) {
      if (!layers.includes(sticker.position[axisIndex])) continue;
      const target = destinations.get(key(rotate(sticker.position, axis, angle), rotate(sticker.normal, axis, angle)));
      this.faces[target.face][target.index] = before[sticker.face][sticker.index];
    }
  }

  static parseAlgorithm(algStr) {
    if (!algStr) return [];
    const tokens = algStr.replace(/[’‘`]/g, "'").match(/\(|\)|[^\s()]+/g) || [];
    let cursor = 0;
    const read = (nested = false, depth = 0) => {
      if (depth > 16) throw new Error('Algorithm groups are nested too deeply.');
      const moves = [];
      while (cursor < tokens.length) {
        const token = tokens[cursor++];
        if (token === ')') {
          if (!nested) throw new Error('Unexpected closing parenthesis.');
          return moves;
        }
        if (token === '(') {
          const group = read(true, depth + 1);
          const count = /^\d+$/.test(tokens[cursor] || '') ? Number(tokens[cursor++]) : 1;
          if (count < 1 || count > 100 || moves.length + group.length * count > 1000) throw new Error('Algorithm repetition is too large.');
          for (let i = 0; i < count; i++) moves.push(...group);
        } else {
          getMove(token);
          moves.push(token.replace(/2'$/, '2'));
        }
        if (moves.length > 1000) throw new Error('Algorithm is too long.');
      }
      if (nested) throw new Error('Missing closing parenthesis.');
      return moves;
    };
    return read();
  }

  static invertAlgorithm(algStr) {
    return Cube.parseAlgorithm(algStr).reverse().map(m => m.endsWith('2') ? m : m.endsWith("'") ? m.slice(0, -1) : m + "'").join(' ');
  }

  applyAlgorithm(algStr) {
    const moves = Cube.parseAlgorithm(algStr);
    for (const move of moves) this.applyMove(move);
    return moves;
  }
}
