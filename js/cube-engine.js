/**
 * CubeEngine - Pure JavaScript 3x3 Rubik's Cube Simulator
 * Tracks 54 facelets across 6 faces: U, D, F, B, L, R
 * Colors: White (U/D), Yellow (U/D), Green (F), Blue (B), Orange (L), Red (R)
 * Default Speedcubing Orientation (White on Bottom, Yellow on Top):
 * U = Yellow, D = White, F = Green, B = Blue, L = Orange, R = Red
 */

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

export class Cube {
  constructor() {
    this.reset();
  }

  reset() {
    // Each face has 9 stickers indexed 0..8 (row-major: top-left to bottom-right)
    this.faces = {
      U: Array(9).fill('U'),
      D: Array(9).fill('D'),
      F: Array(9).fill('F'),
      B: Array(9).fill('B'),
      L: Array(9).fill('L'),
      R: Array(9).fill('R')
    };
  }

  clone() {
    const copy = new Cube();
    for (const f of ['U', 'D', 'F', 'B', 'L', 'R']) {
      copy.faces[f] = [...this.faces[f]];
    }
    return copy;
  }

  // Helper to rotate a single face clockwise
  _rotateFaceCW(face) {
    const f = this.faces[face];
    const prev = [...f];
    // 0 1 2 -> 6 3 0
    // 3 4 5 -> 7 4 1
    // 6 7 8 -> 8 5 2
    f[0] = prev[6]; f[1] = prev[3]; f[2] = prev[0];
    f[3] = prev[7]; f[4] = prev[4]; f[5] = prev[1];
    f[6] = prev[8]; f[7] = prev[5]; f[8] = prev[2];
  }

  _rotateFaceCCW(face) {
    const f = this.faces[face];
    const prev = [...f];
    f[0] = prev[2]; f[1] = prev[5]; f[2] = prev[8];
    f[3] = prev[1]; f[4] = prev[4]; f[5] = prev[7];
    f[6] = prev[0]; f[7] = prev[3]; f[8] = prev[6];
  }

  // Move implementations
  moveU() {
    this._rotateFaceCW('U');
    const { F, R, B, L } = this.faces;
    const temp = [F[0], F[1], F[2]];
    F[0] = R[0]; F[1] = R[1]; F[2] = R[2];
    R[0] = B[0]; R[1] = B[1]; R[2] = B[2];
    B[0] = L[0]; B[1] = L[1]; B[2] = L[2];
    L[0] = temp[0]; L[1] = temp[1]; L[2] = temp[2];
  }

  moveUPrime() {
    this._rotateFaceCCW('U');
    const { F, R, B, L } = this.faces;
    const temp = [F[0], F[1], F[2]];
    F[0] = L[0]; F[1] = L[1]; F[2] = L[2];
    L[0] = B[0]; L[1] = B[1]; L[2] = B[2];
    B[0] = R[0]; B[1] = R[1]; B[2] = R[2];
    R[0] = temp[0]; R[1] = temp[1]; R[2] = temp[2];
  }

  moveD() {
    this._rotateFaceCW('D');
    const { F, L, B, R } = this.faces;
    const temp = [F[6], F[7], F[8]];
    F[6] = L[6]; F[7] = L[7]; F[8] = L[8];
    L[6] = B[6]; L[7] = B[7]; L[8] = B[8];
    B[6] = R[6]; B[7] = R[7]; B[8] = R[8];
    R[6] = temp[0]; R[7] = temp[1]; R[8] = temp[2];
  }

  moveDPrime() {
    this._rotateFaceCCW('D');
    const { F, L, B, R } = this.faces;
    const temp = [F[6], F[7], F[8]];
    F[6] = R[6]; F[7] = R[7]; F[8] = R[8];
    R[6] = B[6]; R[7] = B[7]; R[8] = B[8];
    B[6] = L[6]; B[7] = L[7]; B[8] = L[8];
    L[6] = temp[0]; L[7] = temp[1]; L[8] = temp[2];
  }

  moveR() {
    this._rotateFaceCW('R');
    const { U, B, D, F } = this.faces;
    const temp = [U[2], U[5], U[8]];
    U[2] = F[2]; U[5] = F[5]; U[8] = F[8];
    F[2] = D[2]; F[5] = D[5]; F[8] = D[8];
    D[2] = B[6]; D[5] = B[3]; D[8] = B[0]; // B is inverted in column view
    B[6] = temp[0]; B[3] = temp[1]; B[0] = temp[2];
  }

  moveRPrime() {
    this._rotateFaceCCW('R');
    const { U, B, D, F } = this.faces;
    const temp = [U[2], U[5], U[8]];
    U[2] = B[6]; U[5] = B[3]; U[8] = B[0];
    B[6] = D[2]; B[3] = D[5]; B[0] = D[8];
    D[2] = F[2]; D[5] = F[5]; D[8] = F[8];
    F[2] = temp[0]; F[5] = temp[1]; F[8] = temp[2];
  }

  moveL() {
    this._rotateFaceCW('L');
    const { U, F, D, B } = this.faces;
    const temp = [U[0], U[3], U[6]];
    U[0] = B[8]; U[3] = B[5]; U[6] = B[2];
    B[8] = D[0]; B[5] = D[3]; B[2] = D[6];
    D[0] = F[0]; D[3] = F[3]; D[6] = F[6];
    F[0] = temp[0]; F[3] = temp[1]; F[6] = temp[2];
  }

  moveLPrime() {
    this._rotateFaceCCW('L');
    const { U, F, D, B } = this.faces;
    const temp = [U[0], U[3], U[6]];
    U[0] = F[0]; U[3] = F[3]; U[6] = F[6];
    F[0] = D[0]; F[3] = D[3]; F[6] = D[6];
    D[0] = B[8]; D[3] = B[5]; D[6] = B[2];
    B[8] = temp[0]; B[5] = temp[1]; B[2] = temp[2];
  }

  moveF() {
    this._rotateFaceCW('F');
    const { U, R, D, L } = this.faces;
    const temp = [U[6], U[7], U[8]];
    U[6] = L[8]; U[7] = L[5]; U[8] = L[2];
    L[2] = D[0]; L[5] = D[1]; L[8] = D[2];
    D[0] = R[6]; D[1] = R[3]; D[2] = R[0];
    R[0] = temp[0]; R[3] = temp[1]; R[6] = temp[2];
  }

  moveFPrime() {
    this._rotateFaceCCW('F');
    const { U, R, D, L } = this.faces;
    const temp = [U[6], U[7], U[8]];
    U[6] = R[0]; U[7] = R[3]; U[8] = R[6];
    R[0] = D[2]; R[3] = D[1]; R[6] = D[0];
    D[0] = L[2]; D[1] = L[5]; D[2] = L[8];
    L[2] = temp[2]; L[5] = temp[1]; L[8] = temp[0];
  }

  moveB() {
    this._rotateFaceCW('B');
    const { U, L, D, R } = this.faces;
    const temp = [U[0], U[1], U[2]];
    U[0] = R[2]; U[1] = R[5]; U[2] = R[8];
    R[2] = D[8]; R[5] = D[7]; R[8] = D[6];
    D[6] = L[0]; D[7] = L[3]; D[8] = L[6];
    L[0] = temp[2]; L[3] = temp[1]; L[6] = temp[0];
  }

  moveBPrime() {
    this._rotateFaceCCW('B');
    const { U, L, D, R } = this.faces;
    const temp = [U[0], U[1], U[2]];
    U[0] = L[6]; U[1] = L[3]; U[2] = L[0];
    L[0] = D[6]; L[3] = D[7]; L[6] = D[8];
    D[6] = R[8]; D[7] = R[5]; D[8] = R[2];
    R[2] = temp[0]; R[5] = temp[1]; R[8] = temp[2];
  }

  // M Slice: Middle layer in direction of L
  moveM() {
    const { U, F, D, B } = this.faces;
    const temp = [U[1], U[4], U[7]];
    U[1] = B[7]; U[4] = B[4]; U[7] = B[1];
    B[7] = D[1]; B[4] = D[4]; B[1] = D[7];
    D[1] = F[1]; D[4] = F[4]; D[7] = F[7];
    F[1] = temp[0]; F[4] = temp[1]; F[7] = temp[2];
  }

  moveMPrime() {
    const { U, F, D, B } = this.faces;
    const temp = [U[1], U[4], U[7]];
    U[1] = F[1]; U[4] = F[4]; U[7] = F[7];
    F[1] = D[1]; F[4] = D[4]; F[7] = D[7];
    D[1] = B[7]; D[4] = B[4]; D[7] = B[1];
    B[7] = temp[0]; B[4] = temp[1]; B[1] = temp[2];
  }

  // Rotations
  rotateY() {
    this._rotateFaceCW('U');
    this._rotateFaceCCW('D');
    const temp = this.faces.F;
    this.faces.F = this.faces.R;
    this.faces.R = this.faces.B;
    this.faces.B = this.faces.L;
    this.faces.L = temp;
  }

  rotateYPrime() {
    this._rotateFaceCCW('U');
    this._rotateFaceCW('D');
    const temp = this.faces.F;
    this.faces.F = this.faces.L;
    this.faces.L = this.faces.B;
    this.faces.B = this.faces.R;
    this.faces.R = temp;
  }

  rotateX() {
    this._rotateFaceCW('R');
    this._rotateFaceCCW('L');
    const temp = this.faces.U;
    this.faces.U = this.faces.F;
    this.faces.F = this.faces.D;
    // D to B is inverted
    this.faces.D = [
      this.faces.B[8], this.faces.B[7], this.faces.B[6],
      this.faces.B[5], this.faces.B[4], this.faces.B[3],
      this.faces.B[2], this.faces.B[1], this.faces.B[0]
    ];
    this.faces.B = [
      temp[8], temp[7], temp[6],
      temp[5], temp[4], temp[3],
      temp[2], temp[1], temp[0]
    ];
  }

  rotateXPrime() {
    this.rotateX();
    this.rotateX();
    this.rotateX();
  }

  rotateZ() {
    this.rotateY();
    this.rotateX();
    this.rotateYPrime();
  }

  rotateZPrime() {
    this.rotateY();
    this.rotateXPrime();
    this.rotateYPrime();
  }

  // Execute a single move string
  applyMove(move) {
    if (!move) return;
    const clean = move.trim();

    switch (clean) {
      case 'U': this.moveU(); break;
      case "U'": case 'U’': this.moveUPrime(); break;
      case 'U2': this.moveU(); this.moveU(); break;

      case 'D': this.moveD(); break;
      case "D'": case 'D’': this.moveDPrime(); break;
      case 'D2': this.moveD(); this.moveD(); break;

      case 'R': this.moveR(); break;
      case "R'": case 'R’': this.moveRPrime(); break;
      case 'R2': this.moveR(); this.moveR(); break;

      case 'L': this.moveL(); break;
      case "L'": case 'L’': this.moveLPrime(); break;
      case 'L2': this.moveL(); this.moveL(); break;

      case 'F': this.moveF(); break;
      case "F'": case 'F’': this.moveFPrime(); break;
      case 'F2': this.moveF(); this.moveF(); break;

      case 'B': this.moveB(); break;
      case "B'": case 'B’': this.moveBPrime(); break;
      case 'B2': this.moveB(); this.moveB(); break;

      // Slice M
      case 'M': this.moveM(); break;
      case "M'": case 'M’': this.moveMPrime(); break;
      case 'M2': this.moveM(); this.moveM(); break;

      // Wide moves
      case 'r': case 'Rw':
        this.moveR(); this.moveMPrime(); break;
      case "r'": case "Rw'":
        this.moveRPrime(); this.moveM(); break;
      case 'r2': case 'Rw2':
        this.applyMove('r'); this.applyMove('r'); break;

      case 'l': case 'Lw':
        this.moveL(); this.moveM(); break;
      case "l'": case "Lw'":
        this.moveLPrime(); this.moveMPrime(); break;
      case 'l2': case 'Lw2':
        this.applyMove('l'); this.applyMove('l'); break;

      case 'f': case 'Fw':
        this.moveF(); this.rotateZ(); this.moveBPrime(); break;
      case "f'": case "Fw'":
        this.moveFPrime(); this.rotateZPrime(); this.moveB(); break;
      case 'f2': case 'Fw2':
        this.applyMove('f'); this.applyMove('f'); break;

      case 'u': case 'Uw':
        this.moveU(); this.moveDPrime(); this.rotateY(); break;
      case "u'": case "Uw'":
        this.moveUPrime(); this.moveD(); this.rotateYPrime(); break;
      case 'u2': case 'Uw2':
        this.applyMove('u'); this.applyMove('u'); break;

      case 'd': case 'Dw':
        this.moveD(); this.moveUPrime(); this.rotateYPrime(); break;
      case "d'": case "Dw'":
        this.moveDPrime(); this.moveU(); this.rotateY(); break;
      case 'd2': case 'Dw2':
        this.applyMove('d'); this.applyMove('d'); break;

      // Rotations
      case 'y': this.rotateY(); break;
      case "y'": case 'y’': this.rotateYPrime(); break;
      case 'y2': this.rotateY(); this.rotateY(); break;

      case 'x': this.rotateX(); break;
      case "x'": case 'x’': this.rotateXPrime(); break;
      case 'x2': this.rotateX(); this.rotateX(); break;

      case 'z': this.rotateZ(); break;
      case "z'": case 'z’': this.rotateZPrime(); break;
      case 'z2': this.rotateZ(); this.rotateZ(); break;

      default:
        console.warn(`Unknown move: ${move}`);
    }
  }

  // Parse algorithm string into list of individual moves
  static parseAlgorithm(algStr) {
    if (!algStr) return [];
    // Clean string: replace smart quotes, remove comments/parentheses
    let cleaned = algStr
      .replace(/[’‘`]/g, "'")
      .replace(/[()[\]{}]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleaned) return [];
    return cleaned.split(' ').filter(m => m.length > 0);
  }

  // Invert a sequence of moves (e.g., R U R' -> R U' R')
  static invertAlgorithm(algStr) {
    const moves = Cube.parseAlgorithm(algStr);
    const inverted = moves.reverse().map(move => {
      if (move.endsWith("2")) return move;
      if (move.endsWith("'")) return move.slice(0, -1);
      return move + "'";
    });
    return inverted.join(' ');
  }

  // Apply full algorithm string
  applyAlgorithm(algStr) {
    const moves = Cube.parseAlgorithm(algStr);
    for (const m of moves) {
      this.applyMove(m);
    }
    return moves;
  }
}
