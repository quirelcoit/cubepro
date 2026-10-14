/**
 * Speedcube Pro - Notation Curriculum Data
 * Beginner-friendly, comprehensive, and crisp guide to Rubik's cube notation.
 * Covers Face Turns (clockwise, prime, double), Whole-Cube Rotations (x, y, z),
 * Wide Turns, Slices (M, E, S), and Core Triggers.
 */

export const NOTATION_CATEGORIES = [
  { id: 'faces', name: 'Face Turns (R, U, F, L, D, B)', badge: 'Outer Layers' },
  { id: 'rotations', name: 'Cube Rotations (x, y, z)', badge: 'Whole Cube' },
  { id: 'slices', name: 'Slices (M, E, S)', badge: 'Center Slices' },
  { id: 'wide', name: 'Wide Turns (r, u, f, l)', badge: '2 Layers' },
  { id: 'triggers', name: 'Essential Triggers', badge: 'Muscle Memory' }
];

export const NOTATION_MOVES = [
  // ==================== 1. FACE TURNS (R, U, F, L, D, B) ====================
  // --- Right Face ---
  {
    symbol: 'R',
    type: 'clockwise',
    category: 'faces',
    name: 'Right Up',
    axis: 'Right Face',
    direction: 'Turns Right layer UP away from you ⬆️',
    summary: 'Looking directly at the Right side: turns clockwise 90°. The layer moves up away from your chest.',
    howToTurn: 'Push upward with your right thumb under the front edge or roll your right wrist upward.',
    mnemonic: 'R = Right Up ⬆️ (Clockwise 90°)',
    variants: [
      { move: 'R', label: 'Play R (Up ⬆️)' },
      { move: "R'", label: "Play R' (Down ⬇️)" },
      { move: 'R2', label: 'Play R2 (180°)' }
    ]
  },
  {
    symbol: "R'",
    type: 'prime',
    category: 'faces',
    name: 'Right Down (Prime)',
    axis: 'Right Face',
    direction: 'Turns Right layer DOWN toward you ⬇️',
    summary: 'The prime/reverse turn of R. Looking directly at Right: counter-clockwise 90°. Pushes layer down.',
    howToTurn: 'Pull down on the front-right edge with your right fingers or roll your right wrist down.',
    mnemonic: "R' = Right Down ⬇️ (Counter-Clockwise 90°)",
    variants: [
      { move: "R'", label: "Play R' (Down ⬇️)" },
      { move: 'R', label: 'Play R (Up ⬆️)' },
      { move: 'R2', label: 'Play R2 (180°)' }
    ]
  },
  {
    symbol: 'R2',
    type: 'double',
    category: 'faces',
    name: 'Right 180° (Double)',
    axis: 'Right Face',
    direction: 'Turns Right layer 180° (half-turn) ↻',
    summary: 'Turns the Right face twice (180°). Clockwise or counter-clockwise produces the exact same result.',
    howToTurn: 'Double flick or smooth wrist roll through two 90° clicks in one fluid motion.',
    mnemonic: 'R2 = Right Half-Turn 180°',
    variants: [
      { move: 'R2', label: 'Play R2 (180°)' },
      { move: 'R', label: 'Play R (Up)' },
      { move: "R'", label: "Play R' (Down)" }
    ]
  },

  // --- Up (Top) Face ---
  {
    symbol: 'U',
    type: 'clockwise',
    category: 'faces',
    name: 'Top Left',
    axis: 'Up / Top Face',
    direction: 'Turns Top layer to the LEFT ⬅️',
    summary: 'Looking down directly at the Top face: clockwise rotates the upper layer to your left.',
    howToTurn: 'The #1 speedcubing index flick: flick the top-right back corner with your right index finger towards you.',
    mnemonic: 'U = Top Left ⬅️ (Clockwise 90°)',
    variants: [
      { move: 'U', label: 'Play U (Top Left ⬅️)' },
      { move: "U'", label: "Play U' (Top Right ➡️)" },
      { move: 'U2', label: 'Play U2 (180°)' }
    ]
  },
  {
    symbol: "U'",
    type: 'prime',
    category: 'faces',
    name: 'Top Right (Prime)',
    axis: 'Up / Top Face',
    direction: 'Turns Top layer to the RIGHT ➡️',
    summary: 'Looking down at the Top face: counter-clockwise rotates the upper layer to your right.',
    howToTurn: 'Flick the top-left back corner with your LEFT index finger towards you.',
    mnemonic: "U' = Top Right ➡️ (Counter-Clockwise 90°)",
    variants: [
      { move: "U'", label: "Play U' (Top Right ➡️)" },
      { move: 'U', label: 'Play U (Top Left ⬅️)' },
      { move: 'U2', label: 'Play U2 (180°)' }
    ]
  },
  {
    symbol: 'U2',
    type: 'double',
    category: 'faces',
    name: 'Top 180° (Double Flick)',
    axis: 'Up / Top Face',
    direction: 'Turns Top layer 180° (half-turn) ↻',
    summary: 'A 180° rotation of the top layer. Critical in PLL and last-layer corner alignment.',
    howToTurn: 'Double-flick: right index finger flicks 90°, immediately followed by right middle finger flicking the next 90°!',
    mnemonic: 'U2 = Index + Middle Double Flick',
    variants: [
      { move: 'U2', label: 'Play U2 (180°)' },
      { move: 'U', label: 'Play U (Left)' },
      { move: "U'", label: "Play U' (Right)" }
    ]
  },

  // --- Front Face ---
  {
    symbol: 'F',
    type: 'clockwise',
    category: 'faces',
    name: 'Front Clockwise',
    axis: 'Front Face',
    direction: 'Turns Front face CLOCKWISE ↻',
    summary: 'Look directly at the Front face: turns clockwise, exactly like the hands of a wall clock.',
    howToTurn: 'Push the top-right edge down using your right index finger or press downward with right thumb.',
    mnemonic: 'F = Front Clockwise ↻',
    variants: [
      { move: 'F', label: 'Play F (Clockwise ↻)' },
      { move: "F'", label: "Play F' (Counter ↺)" },
      { move: 'F2', label: 'Play F2 (180°)' }
    ]
  },
  {
    symbol: "F'",
    type: 'prime',
    category: 'faces',
    name: 'Front Counter-Clockwise (Prime)',
    axis: 'Front Face',
    direction: 'Turns Front face COUNTER-CLOCKWISE ↺',
    summary: 'Look directly at the Front face: turns counter-clockwise against normal clock hands.',
    howToTurn: 'Push the bottom-right edge upward with your right thumb or flick top-left edge up with left index.',
    mnemonic: "F' = Front Counter-Clockwise ↺",
    variants: [
      { move: "F'", label: "Play F' (Counter ↺)" },
      { move: 'F', label: 'Play F (Clockwise ↻)' },
      { move: 'F2', label: 'Play F2 (180°)' }
    ]
  },
  {
    symbol: 'F2',
    type: 'double',
    category: 'faces',
    name: 'Front 180° (Double)',
    axis: 'Front Face',
    direction: 'Turns Front face 180° (half-turn) ↻',
    summary: 'Rotates the Front face two clicks (180°). Common in beginner cross insertion.',
    howToTurn: 'Use your right thumb to roll the front face through two 90° positions.',
    mnemonic: 'F2 = Front 180° Half-Turn',
    variants: [
      { move: 'F2', label: 'Play F2 (180°)' },
      { move: 'F', label: 'Play F (CW)' },
      { move: "F'", label: "Play F' (CCW)" }
    ]
  },

  // --- Left Face ---
  {
    symbol: 'L',
    type: 'clockwise',
    category: 'faces',
    name: 'Left Down',
    axis: 'Left Face',
    direction: 'Turns Left layer DOWN toward you ⬇️',
    summary: 'Looking directly at the Left face: clockwise pushes the layer DOWN toward you (opposite of R!).',
    howToTurn: 'Pull down on the front-left edge with your left thumb or left fingers.',
    mnemonic: 'L = Left Down ⬇️ (opposite direction of R!)',
    variants: [
      { move: 'L', label: 'Play L (Down ⬇️)' },
      { move: "L'", label: "Play L' (Up ⬆️)" },
      { move: 'L2', label: 'Play L2 (180°)' }
    ]
  },
  {
    symbol: "L'",
    type: 'prime',
    category: 'faces',
    name: 'Left Up (Prime)',
    axis: 'Left Face',
    direction: 'Turns Left layer UP away from you ⬆️',
    summary: 'Looking directly at the Left face: counter-clockwise pushes the layer UP away from you.',
    howToTurn: 'Push upward on the front-left edge with your left thumb under the corner piece.',
    mnemonic: "L' = Left Up ⬆️",
    variants: [
      { move: "L'", label: "Play L' (Up ⬆️)" },
      { move: 'L', label: 'Play L (Down ⬇️)' },
      { move: 'L2', label: 'Play L2 (180°)' }
    ]
  },
  {
    symbol: 'L2',
    type: 'double',
    category: 'faces',
    name: 'Left 180° (Double)',
    axis: 'Left Face',
    direction: 'Turns Left layer 180° (half-turn) ↻',
    summary: 'Turns the Left face 180°. Used when inserting left cross pieces or solving mirror cases.',
    howToTurn: 'Roll the left wrist through two 90° clicks in one fluid movement.',
    mnemonic: 'L2 = Left Half-Turn 180°',
    variants: [
      { move: 'L2', label: 'Play L2 (180°)' },
      { move: 'L', label: 'Play L (Down)' },
      { move: "L'", label: "Play L' (Up)" }
    ]
  },

  // --- Down (Bottom) Face ---
  {
    symbol: 'D',
    type: 'clockwise',
    category: 'faces',
    name: 'Bottom Right',
    axis: 'Down / Bottom Face',
    direction: 'Turns Bottom layer to the RIGHT ➡️',
    summary: 'Looking directly at the bottom face: clockwise turns it to the right (viewed from front: spins right).',
    howToTurn: 'Flick the bottom-back edge with your left ring finger, or pull with your right ring finger.',
    mnemonic: 'D = Bottom Right ➡️',
    variants: [
      { move: 'D', label: 'Play D (Bottom Right ➡️)' },
      { move: "D'", label: "Play D' (Bottom Left ⬅️)" },
      { move: 'D2', label: 'Play D2 (180°)' }
    ]
  },
  {
    symbol: "D'",
    type: 'prime',
    category: 'faces',
    name: 'Bottom Left (Prime)',
    axis: 'Down / Bottom Face',
    direction: 'Turns Bottom layer to the LEFT ⬅️',
    summary: 'Looking directly at the bottom face: counter-clockwise turns it to the left.',
    howToTurn: 'Push the bottom-back edge with your right ring finger from right to left.',
    mnemonic: "D' = Bottom Left ⬅️",
    variants: [
      { move: "D'", label: "Play D' (Bottom Left ⬅️)" },
      { move: 'D', label: 'Play D (Bottom Right ➡️)' },
      { move: 'D2', label: 'Play D2 (180°)' }
    ]
  },
  {
    symbol: 'D2',
    type: 'double',
    category: 'faces',
    name: 'Bottom 180° (Double)',
    axis: 'Down / Bottom Face',
    direction: 'Turns Bottom layer 180° (half-turn) ↻',
    summary: 'Rotates the bottom layer 180°. Essential in advanced Cross alignment and A-perms.',
    howToTurn: 'Double flick: left ring finger followed by left pinky or right ring finger.',
    mnemonic: 'D2 = Bottom 180° Half-Turn',
    variants: [
      { move: 'D2', label: 'Play D2 (180°)' },
      { move: 'D', label: 'Play D (Right)' },
      { move: "D'", label: "Play D' (Left)" }
    ]
  },

  // --- Back Face ---
  {
    symbol: 'B',
    type: 'clockwise',
    category: 'faces',
    name: 'Back Clockwise',
    axis: 'Back Face',
    direction: 'Turns Back layer CLOCKWISE (viewed from back) ↻',
    summary: 'Looking at the cube from behind: turns clockwise. Viewed from the front, top tilts to the right.',
    howToTurn: 'Push the top-back edge with your right index or ring finger without regripping thumbs.',
    mnemonic: 'B = Back Clockwise ↻',
    variants: [
      { move: 'B', label: 'Play B (Clockwise ↻)' },
      { move: "B'", label: "Play B' (Counter ↺)" },
      { move: 'B2', label: 'Play B2 (180°)' }
    ]
  },
  {
    symbol: "B'",
    type: 'prime',
    category: 'faces',
    name: 'Back Counter-Clockwise (Prime)',
    axis: 'Back Face',
    direction: 'Turns Back layer COUNTER-CLOCKWISE ↺',
    summary: 'Looking at the cube from behind: counter-clockwise. Viewed from front, top tilts to the left.',
    howToTurn: 'Pull the top-back edge with your left index or ring finger.',
    mnemonic: "B' = Back Counter ↺",
    variants: [
      { move: "B'", label: "Play B' (Counter ↺)" },
      { move: 'B', label: 'Play B (Clockwise ↻)' },
      { move: 'B2', label: 'Play B2 (180°)' }
    ]
  },
  {
    symbol: 'B2',
    type: 'double',
    category: 'faces',
    name: 'Back 180° (Double)',
    axis: 'Back Face',
    direction: 'Turns Back layer 180° (half-turn) ↻',
    summary: 'Rotates the back layer 180°. Frequently used in beginner cross and F2L back slotting.',
    howToTurn: 'Double flick top-back layer with right index and middle fingers.',
    mnemonic: 'B2 = Back 180° Half-Turn',
    variants: [
      { move: 'B2', label: 'Play B2 (180°)' },
      { move: 'B', label: 'Play B (CW)' },
      { move: "B'", label: "Play B' (CCW)" }
    ]
  },

  // ==================== 2. CUBE ROTATIONS (x, y, z) ====================
  {
    symbol: 'y',
    type: 'clockwise',
    category: 'rotations',
    name: 'Cube Spin Clockwise (y)',
    axis: 'Vertical Axis (Follows U)',
    direction: 'Spins entire cube horizontally CLOCKWISE 🔄',
    summary: 'Rotates the whole cube horizontally without moving any individual layer. Right face becomes Front.',
    howToTurn: 'Loosen your grip slightly and pivot both hands right-to-left. Keep your eyes on the front center.',
    mnemonic: 'y follows U face (Clockwise spin)',
    variants: [
      { move: 'y', label: 'Play y (Clockwise 90°)' },
      { move: "y'", label: "Play y' (Counter 90°)" },
      { move: 'y2', label: 'Play y2 (180° Turnaround)' }
    ]
  },
  {
    symbol: "y'",
    type: 'prime',
    category: 'rotations',
    name: 'Cube Spin Counter (y\')',
    axis: 'Vertical Axis (Follows U\')',
    direction: 'Spins entire cube horizontally COUNTER-CLOCKWISE 🔄',
    summary: 'Spins the entire cube horizontally to the right. Left face becomes the Front face.',
    howToTurn: 'Pivot both hands left-to-right gently between your fingers.',
    mnemonic: "y' follows U' face (Counter spin)",
    variants: [
      { move: "y'", label: "Play y' (Counter 90°)" },
      { move: 'y', label: 'Play y (Clockwise 90°)' },
      { move: 'y2', label: 'Play y2 (180° Turnaround)' }
    ]
  },
  {
    symbol: 'y2',
    type: 'double',
    category: 'rotations',
    name: 'Cube Turnaround (y2)',
    axis: 'Vertical Axis (180°)',
    direction: 'Spins entire cube 180° to look at the BACK 🔄',
    summary: 'Pivots the cube 180° so the Back face becomes the Front face. Keeps Top on top.',
    howToTurn: 'Perform a full 180° horizontal hand pivot. Used to inspect back slots.',
    mnemonic: 'y2 = 180° Turnaround',
    variants: [
      { move: 'y2', label: 'Play y2 (180°)' },
      { move: 'y', label: 'Play y (90° CW)' },
      { move: "y'", label: "Play y' (90° CCW)" }
    ]
  },
  {
    symbol: 'x',
    type: 'clockwise',
    category: 'rotations',
    name: 'Cube Tip Away (x)',
    axis: 'Horizontal Axis (Follows R)',
    direction: 'Tips entire cube AWAY from you vertically 🔄',
    summary: 'Tips the whole cube forward so the Front face becomes the Top face (Bottom becomes Front).',
    howToTurn: 'Tilt your wrists forward away from your body. Thumbs roll from the front center to the bottom.',
    mnemonic: 'x follows R face (Tips away)',
    variants: [
      { move: 'x', label: 'Play x (Tip Away 90°)' },
      { move: "x'", label: "Play x' (Tip Toward 90°)" },
      { move: 'x2', label: 'Play x2 (Full Flip 180°)' }
    ]
  },
  {
    symbol: "x'",
    type: 'prime',
    category: 'rotations',
    name: 'Cube Tip Toward (x\')',
    axis: 'Horizontal Axis (Follows R\')',
    direction: 'Tips entire cube TOWARD you vertically 🔄',
    summary: 'Tips the cube backwards so Top face becomes Front face (Front becomes Bottom).',
    howToTurn: 'Tilt wrists towards yourself. Thumbs roll from front center to top edge.',
    mnemonic: "x' follows R' face (Tips toward you)",
    variants: [
      { move: "x'", label: "Play x' (Tip Toward 90°)" },
      { move: 'x', label: 'Play x (Tip Away 90°)' },
      { move: 'x2', label: 'Play x2 (Full Flip 180°)' }
    ]
  },
  {
    symbol: 'x2',
    type: 'double',
    category: 'rotations',
    name: 'Cube Flip 180° (x2)',
    axis: 'Horizontal Axis (180°)',
    direction: 'Flips entire cube upside down vertically 🔄',
    summary: 'Inverts Top and Bottom faces. White becomes Yellow, Yellow becomes White.',
    howToTurn: 'Full vertical roll of the cube in your hands.',
    mnemonic: 'x2 = Full Vertical Flip',
    variants: [
      { move: 'x2', label: 'Play x2 (180°)' },
      { move: 'x', label: 'Play x (Away)' },
      { move: "x'", label: "Play x' (Toward)" }
    ]
  },
  {
    symbol: 'z',
    type: 'clockwise',
    category: 'rotations',
    name: 'Cube Tilt Right (z)',
    axis: 'Front-Back Axis (Follows F)',
    direction: 'Tilts entire cube CLOCKWISE like a steering wheel 🔄',
    summary: 'Tilts the whole cube sideways. The Top face rolls over to become the Right face.',
    howToTurn: 'Rotate both hands clockwise together, exactly like turning a car steering wheel to the right.',
    mnemonic: 'z follows F face (Tilt Right)',
    variants: [
      { move: 'z', label: 'Play z (Tilt Right 90°)' },
      { move: "z'", label: "Play z' (Tilt Left 90°)" },
      { move: 'z2', label: 'Play z2 (180° Invert)' }
    ]
  },
  {
    symbol: "z'",
    type: 'prime',
    category: 'rotations',
    name: 'Cube Tilt Left (z\')',
    axis: 'Front-Back Axis (Follows F\')',
    direction: 'Tilts entire cube COUNTER-CLOCKWISE 🔄',
    summary: 'Tilts the whole cube sideways to the left. Top face rolls over to become the Left face.',
    howToTurn: 'Rotate both hands counter-clockwise like turning a steering wheel to the left.',
    mnemonic: "z' follows F' face (Tilt Left)",
    variants: [
      { move: "z'", label: "Play z' (Tilt Left 90°)" },
      { move: 'z', label: 'Play z (Tilt Right 90°)' },
      { move: 'z2', label: 'Play z2 (180° Invert)' }
    ]
  },
  {
    symbol: 'z2',
    type: 'double',
    category: 'rotations',
    name: 'Cube Tilt 180° (z2)',
    axis: 'Front-Back Axis (180°)',
    direction: 'Inverts cube sideways 180° 🔄',
    summary: 'Rolls the cube 180° sideways. Left and Right swap places while Front stays in front.',
    howToTurn: 'Turn both hands 180° like steering a full half-turn.',
    mnemonic: 'z2 = Sideways Invert 180°',
    variants: [
      { move: 'z2', label: 'Play z2 (180°)' },
      { move: 'z', label: 'Play z (Right)' },
      { move: "z'", label: "Play z' (Left)" }
    ]
  },

  // ==================== 3. SLICES (M, E, S) ====================
  {
    symbol: "M'",
    type: 'prime',
    category: 'slices',
    name: "Middle Slice Up (M')",
    axis: 'Between L and R',
    direction: 'Pushes Middle slice UPWARD ☝️',
    summary: 'CRITICAL MOVE: Used in 95% of CFOP slice algorithms (H-Perm, Z-Perm, U-Perm)! Follows L\' direction (pushes UP).',
    howToTurn: 'The famous ring-finger flick: place your left or right ring finger on the bottom-back center edge and flick UPWARD!',
    mnemonic: "M' = Ring-Finger Upward Flick ☝️",
    variants: [
      { move: "M'", label: "Play M' (Upward Flick ☝️)" },
      { move: 'M', label: 'Play M (Middle Down ⬇️)' },
      { move: 'M2', label: 'Play M2 (Double Flick)' }
    ]
  },
  {
    symbol: 'M',
    type: 'clockwise',
    category: 'slices',
    name: 'Middle Slice Down (M)',
    axis: 'Between L and R',
    direction: 'Turns Middle slice DOWNWARD ⬇️',
    summary: 'Follows the L face direction: turns the center vertical slice DOWNWARD toward you.',
    howToTurn: 'Push down on the top-center edge with your right index finger or pull with your left thumb.',
    mnemonic: 'M follows L face (Pushes Down ⬇️)',
    variants: [
      { move: 'M', label: 'Play M (Middle Down ⬇️)' },
      { move: "M'", label: "Play M' (Middle Up ☝️)" },
      { move: 'M2', label: 'Play M2 (Double Flick)' }
    ]
  },
  {
    symbol: 'M2',
    type: 'double',
    category: 'slices',
    name: 'Middle 180° (M2)',
    axis: 'Between L and R',
    direction: 'Turns Middle slice 180° ↻',
    summary: 'The signature move in H-Perm and Z-Perm! Flips the top and bottom center edges.',
    howToTurn: 'Double-flick: ring finger followed immediately by middle finger flicking the bottom-back edge upward!',
    mnemonic: 'M2 = Ring + Middle Double Flick',
    variants: [
      { move: 'M2', label: 'Play M2 (180° Double Flick)' },
      { move: "M'", label: "Play M' (Up)" },
      { move: 'M', label: 'Play M (Down)' }
    ]
  },
  {
    symbol: 'E',
    type: 'clockwise',
    category: 'slices',
    name: 'Equator Slice Right (E)',
    axis: 'Between U and D',
    direction: 'Turns Equator slice to the RIGHT ➡️',
    summary: 'The horizontal center slice between Top and Bottom. Follows the D face direction (turns right).',
    howToTurn: 'Hold top and bottom layers steady with your hands and push the middle layer.',
    mnemonic: 'E follows D face direction',
    variants: [
      { move: 'E', label: 'Play E (Slice Right ➡️)' },
      { move: "E'", label: "Play E' (Slice Left ⬅️)" },
      { move: 'E2', label: 'Play E2 (180°)' }
    ]
  },
  {
    symbol: "E'",
    type: 'prime',
    category: 'slices',
    name: 'Equator Slice Left (E\')',
    axis: 'Between U and D',
    direction: 'Turns Equator slice to the LEFT ⬅️',
    summary: 'Counter-clockwise equator turn. Follows D\' direction.',
    howToTurn: 'Hold top and bottom layers and pull the center layer to the left.',
    mnemonic: "E' follows D' face direction",
    variants: [
      { move: "E'", label: "Play E' (Slice Left ⬅️)" },
      { move: 'E', label: 'Play E (Slice Right ➡️)' },
      { move: 'E2', label: 'Play E2 (180°)' }
    ]
  },
  {
    symbol: 'S',
    type: 'clockwise',
    category: 'slices',
    name: 'Standing Slice (S)',
    axis: 'Between F and B',
    direction: 'Turns Standing slice CLOCKWISE ↻',
    summary: 'The vertical center slice parallel to the Front face. Follows the F face direction (clockwise).',
    howToTurn: 'Push the top-center edge with your right index finger while holding front and back layers.',
    mnemonic: 'S follows F face direction',
    variants: [
      { move: 'S', label: 'Play S (Clockwise ↻)' },
      { move: "S'", label: "Play S' (Counter ↺)" },
      { move: 'S2', label: 'Play S2 (180°)' }
    ]
  },
  {
    symbol: "S'",
    type: 'prime',
    category: 'slices',
    name: 'Standing Slice Counter (S\')',
    axis: 'Between F and B',
    direction: 'Turns Standing slice COUNTER-CLOCKWISE ↺',
    summary: 'Counter-clockwise standing slice. Follows F\' direction.',
    howToTurn: 'Push bottom-center edge upward with thumb while steadying front and back layers.',
    mnemonic: "S' follows F' face direction",
    variants: [
      { move: "S'", label: "Play S' (Counter ↺)" },
      { move: 'S', label: 'Play S (Clockwise ↻)' },
      { move: 'S2', label: 'Play S2 (180°)' }
    ]
  },

  // ==================== 4. WIDE TURNS (r, u, f, l) ====================
  {
    symbol: 'r',
    type: 'clockwise',
    category: 'wide',
    name: 'Wide Right Up (r / Rw)',
    axis: 'Right + Middle',
    direction: 'Turns Right layer AND Middle slice UP together ⬆️',
    summary: 'Moves two vertical layers simultaneously. Lowercase "r" means a double-layer turn.',
    howToTurn: 'Place your thumb across both right and center front pieces and push upward together.',
    mnemonic: 'r = Right 2 layers UP ⬆️',
    variants: [
      { move: 'r', label: 'Play r (2 Layers Up ⬆️)' },
      { move: "r'", label: "Play r' (2 Layers Down ⬇️)" },
      { move: 'r2', label: 'Play r2 (180°)' }
    ]
  },
  {
    symbol: "r'",
    type: 'prime',
    category: 'wide',
    name: 'Wide Right Down (r\' / Rw\')',
    axis: 'Right + Middle',
    direction: 'Turns Right layer AND Middle slice DOWN together ⬇️',
    summary: 'Pulls two right layers down simultaneously. Crucial in OLL algorithms.',
    howToTurn: 'Grip both right and middle layers with right fingers and pull downward together.',
    mnemonic: "r' = Right 2 layers DOWN ⬇️",
    variants: [
      { move: "r'", label: "Play r' (2 Layers Down ⬇️)" },
      { move: 'r', label: 'Play r (2 Layers Up ⬆️)' },
      { move: 'r2', label: 'Play r2 (180°)' }
    ]
  },
  {
    symbol: 'u',
    type: 'clockwise',
    category: 'wide',
    name: 'Wide Top Left (u / Uw)',
    axis: 'Top + Equator',
    direction: 'Turns Top TWO layers to the Left together ⬅️',
    summary: 'Turns both the top layer and middle horizontal layer at the same time.',
    howToTurn: 'Hold the bottom layer steady and flick upper two layers together.',
    mnemonic: 'u = Top 2 layers Left ⬅️',
    variants: [
      { move: 'u', label: 'Play u (Top 2 Left ⬅️)' },
      { move: "u'", label: "Play u' (Top 2 Right ➡️)" },
      { move: 'u2', label: 'Play u2 (180°)' }
    ]
  },
  {
    symbol: "u'",
    type: 'prime',
    category: 'wide',
    name: 'Wide Top Right (u\' / Uw\')',
    axis: 'Top + Equator',
    direction: 'Turns Top TWO layers to the Right together ➡️',
    summary: 'Counter-clockwise wide turn of top two layers.',
    howToTurn: 'Flick upper two layers to the right with left hand while steadying bottom.',
    mnemonic: "u' = Top 2 layers Right ➡️",
    variants: [
      { move: "u'", label: "Play u' (Top 2 Right ➡️)" },
      { move: 'u', label: 'Play u (Top 2 Left ⬅️)' },
      { move: 'u2', label: 'Play u2 (180°)' }
    ]
  },
  {
    symbol: 'f',
    type: 'clockwise',
    category: 'wide',
    name: 'Wide Front Clockwise (f / Fw)',
    axis: 'Front + Standing',
    direction: 'Turns Front TWO layers CLOCKWISE together ↻',
    summary: 'Turns both the front face and standing slice clockwise. Very common in F2L and 2-Look OLL!',
    howToTurn: 'Place index finger on top of both front layers and push down clockwise together.',
    mnemonic: 'f = Front 2 layers Clockwise ↻',
    variants: [
      { move: 'f', label: 'Play f (Front 2 CW ↻)' },
      { move: "f'", label: "Play f' (Front 2 CCW ↺)" },
      { move: 'f2', label: 'Play f2 (180°)' }
    ]
  },
  {
    symbol: "f'",
    type: 'prime',
    category: 'wide',
    name: 'Wide Front Counter (f\' / Fw\')',
    axis: 'Front + Standing',
    direction: 'Turns Front TWO layers COUNTER-CLOCKWISE ↺',
    summary: 'Turns both front layers counter-clockwise back into position.',
    howToTurn: 'Push upward on both front layers with your right thumb.',
    mnemonic: "f' = Front 2 layers Counter ↺",
    variants: [
      { move: "f'", label: "Play f' (Front 2 CCW ↺)" },
      { move: 'f', label: 'Play f (Front 2 CW ↻)' },
      { move: 'f2', label: 'Play f2 (180°)' }
    ]
  },
  {
    symbol: 'l',
    type: 'clockwise',
    category: 'wide',
    name: 'Wide Left Down (l / Lw)',
    axis: 'Left + Middle',
    direction: 'Turns Left layer AND Middle slice DOWN together ⬇️',
    summary: 'Moves two vertical layers on the left side downward simultaneously.',
    howToTurn: 'Grip both left and center pieces with left hand and pull downward together.',
    mnemonic: 'l = Left 2 layers DOWN ⬇️',
    variants: [
      { move: 'l', label: 'Play l (2 Layers Down ⬇️)' },
      { move: "l'", label: "Play l' (2 Layers Up ⬆️)" },
      { move: 'l2', label: 'Play l2 (180°)' }
    ]
  },
  {
    symbol: "l'",
    type: 'prime',
    category: 'wide',
    name: 'Wide Left Up (l\' / Lw\')',
    axis: 'Left + Middle',
    direction: 'Turns Left layer AND Middle slice UP together ⬆️',
    summary: 'Pushes two left layers upward away from you simultaneously.',
    howToTurn: 'Push upward on left and center layers with left thumb.',
    mnemonic: "l' = Left 2 layers UP ⬆️",
    variants: [
      { move: "l'", label: "Play l' (2 Layers Up ⬆️)" },
      { move: 'l', label: 'Play l (2 Layers Down ⬇️)' },
      { move: 'l2', label: 'Play l2 (180°)' }
    ]
  },

  // ==================== 5. ESSENTIAL TRIGGERS ====================
  {
    symbol: 'Sexy',
    type: 'sequence',
    category: 'triggers',
    name: 'The "Sexy Move"',
    algorithm: "R U R' U'",
    axis: 'Right & Top Layers',
    direction: 'Right Up, Top Left, Right Down, Top Right',
    summary: 'The absolute #1 muscle memory trigger in all of speedcubing. Repeating it 6 times returns the cube to solved!',
    howToTurn: 'Right wrist up (R), right index flick (U), right wrist down (R\'), left index flick (U\').',
    mnemonic: 'Up, Left, Down, Right (4 clicks)',
    variants: [
      { move: "R U R' U'", label: 'Play Sexy Move (R U R\' U\')' }
    ]
  },
  {
    symbol: 'RevSexy',
    type: 'sequence',
    category: 'triggers',
    name: 'Reverse Sexy Move',
    algorithm: "U R U' R'",
    axis: 'Top & Right Layers',
    direction: 'Top Left, Right Up, Top Right, Right Down',
    summary: 'The exact inverse of the Sexy Move. Essential for high-speed F2L slot insertions.',
    howToTurn: 'Right index flick (U), right wrist up (R), left index flick (U\'), right wrist down (R\').',
    mnemonic: 'Inverse of Sexy Move',
    variants: [
      { move: "U R U' R'", label: 'Play Reverse Sexy (U R U\' R\')' }
    ]
  },
  {
    symbol: 'Sledge',
    type: 'sequence',
    category: 'triggers',
    name: 'The Sledgehammer',
    algorithm: "R' F R F'",
    axis: 'Right & Front Layers',
    direction: 'Right Down, Front Clockwise, Right Up, Front Counter',
    summary: 'A legendary trigger. Inserts an F2L corner-edge pair while flipping the top edges to orient yellow cross early!',
    howToTurn: 'Right wrist down (R\'), right index pushes front down (F), right wrist up (R), right thumb pushes front back up (F\').',
    mnemonic: 'Down, Front, Up, Back (R\' F R F\')',
    variants: [
      { move: "R' F R F'", label: 'Play Sledgehammer (R\' F R F\')' }
    ]
  },
  {
    symbol: 'Hedge',
    type: 'sequence',
    category: 'triggers',
    name: 'The Hedgeslammer',
    algorithm: "F R' F' R",
    axis: 'Front & Right Layers',
    direction: 'Front Clockwise, Right Down, Front Counter, Right Up',
    summary: 'The inverse of the Sledgehammer. Used to insert pairs from opposite angles cleanly.',
    howToTurn: 'Front down (F), right wrist down (R\'), front up (F\'), right wrist up (R).',
    mnemonic: 'Inverse of Sledgehammer (F R\' F\' R)',
    variants: [
      { move: "F R' F' R", label: 'Play Hedgeslammer (F R\' F\' R)' }
    ]
  },
  {
    symbol: 'Sune',
    type: 'sequence',
    category: 'triggers',
    name: 'The Sune Trigger (OLL)',
    algorithm: "R U R' U R U2 R'",
    axis: 'Last Layer Corner OLL',
    direction: 'Up, Left, Down, Left, Up, 180°, Down',
    summary: 'The most famous OLL algorithm in the world. Orients 3 yellow corners while preserving F2L.',
    howToTurn: 'R U R\' U R, then double-flick U2 with right index + middle finger, then R\'.',
    mnemonic: 'R U R\' U R U2 R\'',
    variants: [
      { move: "R U R' U R U2 R'", label: 'Play Sune (OLL)' }
    ]
  },
  {
    symbol: 'AntiSune',
    type: 'sequence',
    category: 'triggers',
    name: 'Anti-Sune (OLL)',
    algorithm: "R U2 R' U' R U' R'",
    axis: 'Last Layer Corner OLL',
    direction: 'Up, 180°, Down, Right, Up, Right, Down',
    summary: 'The exact mirror of the Sune algorithm. Orients yellow corners from the opposite angle.',
    howToTurn: 'R followed by U2 double-flick, then R\' U\' R U\' R\'.',
    mnemonic: 'R U2 R\' U\' R U\' R\'',
    variants: [
      { move: "R U2 R' U' R U' R'", label: 'Play Anti-Sune (OLL)' }
    ]
  }
];
