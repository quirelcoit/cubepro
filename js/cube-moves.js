// Coordinates: right +X, up +Y, front +Z. Signs follow the right-hand rule.
export const MOVE_SPECS = {
  U: ['y', [1], -1], D: ['y', [-1], 1],
  R: ['x', [1], -1], L: ['x', [-1], 1],
  F: ['z', [1], -1], B: ['z', [-1], 1],
  M: ['x', [0], 1], E: ['y', [0], 1], S: ['z', [0], -1],
  r: ['x', [0, 1], -1], l: ['x', [-1, 0], 1],
  u: ['y', [0, 1], -1], d: ['y', [-1, 0], 1],
  f: ['z', [0, 1], -1], b: ['z', [-1, 0], 1],
  x: ['x', [-1, 0, 1], -1], y: ['y', [-1, 0, 1], -1], z: ['z', [-1, 0, 1], -1]
};

export function getMove(move) {
  const clean = String(move).trim().replace(/[’‘`]/g, "'");
  const match = /^([URFDLB]w|[URFDLBMESxyzurfdlb])(2'?|')?$/.exec(clean);
  if (!match) throw new Error(`Unsupported move: ${move}`);
  const base = match[1].endsWith('w') ? match[1][0].toLowerCase() : match[1];
  const [axis, layers, sign] = MOVE_SPECS[base];
  const suffix = match[2] || '';
  const turns = suffix.startsWith('2') ? 2 : 1;
  return { axis, layers, angle: sign * (suffix === "'" ? -1 : 1) * turns * Math.PI / 2 };
}

// The same face coordinates are used for logical stickers and renderer materials.
export const FACELETS = [];
for (const face of ['U', 'D', 'F', 'B', 'L', 'R']) {
  for (let index = 0; index < 9; index++) {
    const row = Math.floor(index / 3), col = index % 3;
    const positions = {
      U: [col - 1, 1, row - 1], D: [col - 1, -1, 1 - row],
      F: [col - 1, 1 - row, 1], B: [1 - col, 1 - row, -1],
      L: [-1, 1 - row, col - 1], R: [1, 1 - row, 1 - col]
    };
    const normals = { U: [0, 1, 0], D: [0, -1, 0], F: [0, 0, 1], B: [0, 0, -1], L: [-1, 0, 0], R: [1, 0, 0] };
    FACELETS.push({ face, index, position: positions[face], normal: normals[face] });
  }
}
