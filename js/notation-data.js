/**
 * Speedcube Pro - Notation Curriculum Data
 * Beginner-friendly, minimalist, complete guide to Rubik's cube notation.
 * Covers basic faces, full-cube rotations (x, y, z), wide turns, slices, and core triggers.
 */

export const NOTATION_CATEGORIES = [
  { id: 'rotations', name: 'Cube Rotations (x, y, z)', badge: 'Whole Cube' },
  { id: 'faces', name: 'Face Turns (R, L, U, D, F, B)', badge: 'Outer Layers' },
  { id: 'wide', name: 'Wide Turns (r, l, u, f)', badge: '2 Layers' },
  { id: 'slices', name: 'Slices (M, E, S)', badge: 'Inner Slices' },
  { id: 'triggers', name: 'Triggers (Muscle Memory)', badge: 'Sequences' }
];

export const NOTATION_MOVES = [
  // --- Cube Rotations ---
  {
    symbol: 'y',
    category: 'rotations',
    name: 'Horizontal Cube Spin',
    axis: 'Follows U Face',
    direction: 'Spins entire cube horizontally clockwise',
    summary: 'Turn the whole cube horizontally without moving any layers. The Right face moves to the Front.',
    howToTurn: 'Loosen your grip slightly and pivot both hands right-to-left. Keep your eyes on the front center piece.',
    mnemonic: 'y follows U (Up face clockwise)',
    variants: [
      { move: 'y', label: 'y (Clockwise 90°)' },
      { move: "y'", label: "y' (Counter 90°)" },
      { move: 'y2', label: 'y2 (Half-turn 180°)' }
    ]
  },
  {
    symbol: 'x',
    category: 'rotations',
    name: 'Vertical Cube Tip',
    axis: 'Follows R Face',
    direction: 'Tips entire cube away from you vertically',
    summary: 'Tips the whole cube so the Front face becomes the Top face (and Bottom becomes Front).',
    howToTurn: 'Tilt your wrists forward away from your body. Thumbs roll from the front center to the bottom.',
    mnemonic: 'x follows R (Right face clockwise)',
    variants: [
      { move: 'x', label: 'x (Tip Away 90°)' },
      { move: "x'", label: "x' (Tip Toward 90°)" },
      { move: 'x2', label: 'x2 (Full Flip 180°)' }
    ]
  },
  {
    symbol: 'z',
    category: 'rotations',
    name: 'Sideways Cube Tilt',
    axis: 'Follows F Face',
    direction: 'Tilts entire cube clockwise like a steering wheel',
    summary: 'Tilts the whole cube sideways. The Top face rolls over to become the Right face.',
    howToTurn: 'Turn both hands clockwise together, exactly like turning a car steering wheel to the right.',
    mnemonic: 'z follows F (Front face clockwise)',
    variants: [
      { move: 'z', label: 'z (Tilt Right 90°)' },
      { move: "z'", label: "z' (Tilt Left 90°)" },
      { move: 'z2', label: 'z2 (Upside Down 180°)' }
    ]
  },

  // --- Face Turns ---
  {
    symbol: 'R',
    category: 'faces',
    name: 'Right Face',
    axis: 'Right Side',
    direction: 'Turns the Right layer UP away from you',
    summary: 'Look directly at the Right side: turning it clockwise pushes the face upward away from your body.',
    howToTurn: 'Push upward with your right thumb under the front edge, or roll your right wrist upward.',
    mnemonic: 'R = Right Up ⬆️ | R\' = Right Down ⬇️',
    variants: [
      { move: 'R', label: 'R (Right Up)' },
      { move: "R'", label: "R' (Right Down)" },
      { move: 'R2', label: 'R2 (Right 180°)' }
    ]
  },
  {
    symbol: 'U',
    category: 'faces',
    name: 'Up (Top) Face',
    axis: 'Top Side',
    direction: 'Turns the Top layer to the LEFT',
    summary: 'Look directly at the Top face: clockwise rotates the layer to the left.',
    howToTurn: 'The essential speedcubing flick: flick the top-right back corner with your right index finger towards you.',
    mnemonic: 'U = Top Left ⬅️ | U\' = Top Right ➡️',
    variants: [
      { move: 'U', label: 'U (Top Left)' },
      { move: "U'", label: "U' (Top Right)" },
      { move: 'U2', label: 'U2 (Double Flick)' }
    ]
  },
  {
    symbol: 'F',
    category: 'faces',
    name: 'Front Face',
    axis: 'Front Side',
    direction: 'Turns the Front face CLOCKWISE',
    summary: 'Look directly at the Front face: turns clockwise just like a normal wall clock.',
    howToTurn: 'Push the top-right edge down using your right index finger, or press with your right thumb.',
    mnemonic: 'F = Clockwise ↻ | F\' = Counter-Clockwise ↺',
    variants: [
      { move: 'F', label: 'F (Clockwise)' },
      { move: "F'", label: "F' (Counter-Clockwise)" },
      { move: 'F2', label: 'F2 (Front 180°)' }
    ]
  },
  {
    symbol: 'L',
    category: 'faces',
    name: 'Left Face',
    axis: 'Left Side',
    direction: 'Turns the Left layer DOWN toward you',
    summary: 'Notice: clockwise when looking directly at the Left face moves the layer DOWN toward you (opposite of R!).',
    howToTurn: 'Pull down on the front-left edge with your left thumb or pull down with your left fingers.',
    mnemonic: 'L = Left Down ⬇️ | L\' = Left Up ⬆️',
    variants: [
      { move: 'L', label: 'L (Left Down)' },
      { move: "L'", label: "L' (Left Up)" },
      { move: 'L2', label: 'L2 (Left 180°)' }
    ]
  },
  {
    symbol: 'D',
    category: 'faces',
    name: 'Down (Bottom) Face',
    axis: 'Bottom Side',
    direction: 'Turns the Bottom layer to the RIGHT',
    summary: 'Looking at the bottom face, clockwise turns it to the right. Looking from the front, it spins to the right.',
    howToTurn: 'Flick the bottom-back edge with your left ring finger, or pull with your right ring finger.',
    mnemonic: 'D = Bottom Right ➡️ | D\' = Bottom Left ⬅️',
    variants: [
      { move: 'D', label: 'D (Bottom Right)' },
      { move: "D'", label: "D' (Bottom Left)" },
      { move: 'D2', label: 'D2 (Bottom 180°)' }
    ]
  },
  {
    symbol: 'B',
    category: 'faces',
    name: 'Back Face',
    axis: 'Back Side',
    direction: 'Turns the Back layer to the LEFT (viewed from back: clockwise)',
    summary: 'Looking at the cube from behind, it turns clockwise. Viewed from the front, the top part tilts to your right.',
    howToTurn: 'Push the top-back edge with your right index or ring finger without re-gripping your thumbs.',
    mnemonic: 'B = Back Clockwise | B\' = Back Counter',
    variants: [
      { move: 'B', label: 'B (Back Clockwise)' },
      { move: "B'", label: "B' (Back Counter)" },
      { move: 'B2', label: 'B2 (Back 180°)' }
    ]
  },

  // --- Wide Turns ---
  {
    symbol: 'r',
    category: 'wide',
    name: 'Wide Right (r / Rw)',
    axis: 'Right + Middle',
    direction: 'Turns Right layer AND Middle slice UP together',
    summary: 'Moves two vertical layers simultaneously. Lowercase letter "r" means a double-layer turn.',
    howToTurn: 'Place your thumb across both the right and center front pieces and push upward together.',
    mnemonic: 'r = Right 2 layers UP',
    variants: [
      { move: 'r', label: 'r (2 Layers Up)' },
      { move: "r'", label: "r' (2 Layers Down)" },
      { move: 'r2', label: 'r2 (2 Layers 180°)' }
    ]
  },
  {
    symbol: 'l',
    category: 'wide',
    name: 'Wide Left (l / Lw)',
    axis: 'Left + Middle',
    direction: 'Turns Left layer AND Middle slice DOWN together',
    summary: 'Moves two vertical layers on the left side simultaneously.',
    howToTurn: 'Grip both left and center pieces with left hand and pull downward together.',
    mnemonic: 'l = Left 2 layers DOWN',
    variants: [
      { move: 'l', label: 'l (2 Layers Down)' },
      { move: "l'", label: "l' (2 Layers Up)" },
      { move: 'l2', label: 'l2 (2 Layers 180°)' }
    ]
  },
  {
    symbol: 'u',
    category: 'wide',
    name: 'Wide Up (u / Uw)',
    axis: 'Top + Equator',
    direction: 'Turns Top TWO layers to the Left together',
    summary: 'Turns both the top layer and middle horizontal layer at the same time.',
    howToTurn: 'Hold the bottom layer with one hand and turn the upper two layers with the other.',
    mnemonic: 'u = Top 2 layers Left',
    variants: [
      { move: 'u', label: 'u (Top 2 Left)' },
      { move: "u'", label: "u' (Top 2 Right)" },
      { move: 'u2', label: 'u2 (Top 2 180°)' }
    ]
  },
  {
    symbol: 'f',
    category: 'wide',
    name: 'Wide Front (f / Fw)',
    axis: 'Front + Standing',
    direction: 'Turns Front TWO layers Clockwise together',
    summary: 'Turns both the front face and standing slice clockwise. Very common in F2L and OLL algorithms!',
    howToTurn: 'Place index finger on top of both front layers and push down clockwise together.',
    mnemonic: 'f = Front 2 layers Clockwise',
    variants: [
      { move: 'f', label: 'f (Front 2 Clockwise)' },
      { move: "f'", label: "f' (Front 2 Counter)" },
      { move: 'f2', label: 'f2 (Front 2 180°)' }
    ]
  },

  // --- Slices ---
  {
    symbol: 'M',
    category: 'slices',
    name: 'Middle Slice (M)',
    axis: 'Between L and R',
    direction: 'Follows L: M turns DOWN, M\' pushes UP',
    summary: 'The vertical center slice between the Left and Right layers. Note: M moves DOWN (follows L), while M\' moves UP.',
    howToTurn: 'M\' flick: Place your left or right ring finger on the bottom-back center edge and flick UPWARD into place.',
    mnemonic: 'M\' is used in 95% of algorithms (H-Perm, Z-Perm)',
    variants: [
      { move: 'M', label: 'M (Middle Down)' },
      { move: "M'", label: "M' (Middle Up / Ring Flick)" },
      { move: 'M2', label: 'M2 (Double Middle Flick)' }
    ]
  },
  {
    symbol: 'E',
    category: 'slices',
    name: 'Equator Slice (E)',
    axis: 'Between U and D',
    direction: 'Follows D: turns horizontally to the Right',
    summary: 'The horizontal center slice between Top and Bottom. Rarely used in speedsolving, but follows D direction.',
    howToTurn: 'Hold top and bottom layers steady with both hands and push the center slice.',
    mnemonic: 'E follows D face direction',
    variants: [
      { move: 'E', label: 'E (Slice Right)' },
      { move: "E'", label: "E' (Slice Left)" },
      { move: 'E2', label: 'E2 (Slice 180°)' }
    ]
  },
  {
    symbol: 'S',
    category: 'slices',
    name: 'Standing Slice (S)',
    axis: 'Between F and B',
    direction: 'Follows F: turns Clockwise',
    summary: 'The vertical center slice parallel to the Front and Back faces. Follows F direction.',
    howToTurn: 'Hold front and back layers and push the middle slice with your index finger.',
    mnemonic: 'S follows F face direction',
    variants: [
      { move: 'S', label: 'S (Slice Clockwise)' },
      { move: "S'", label: "S' (Slice Counter)" },
      { move: 'S2', label: 'S2 (Slice 180°)' }
    ]
  },

  // --- Essential Triggers ---
  {
    symbol: 'Sexy',
    category: 'triggers',
    name: 'The "Sexy Move"',
    algorithm: "R U R' U'",
    direction: 'Right Up, Top Left, Right Down, Top Right',
    summary: 'The absolute #1 muscle memory trigger in all of speedcubing. Repeating it 6 times returns the cube to solved!',
    howToTurn: 'Right wrist up (R), right index flick (U), right wrist down (R\'), left index flick (U\').',
    mnemonic: 'Up, Left, Down, Right (4 clicks)',
    variants: [
      { move: "R U R' U'", label: 'Play Sexy Move' }
    ]
  },
  {
    symbol: 'RevSexy',
    category: 'triggers',
    name: 'Reverse Sexy Move',
    algorithm: "U R U' R'",
    direction: 'Top Left, Right Up, Top Right, Right Down',
    summary: 'The exact inverse of the Sexy Move. Essential for high-speed F2L slot insertions.',
    howToTurn: 'Right index flick (U), right wrist up (R), left index flick (U\'), right wrist down (R\').',
    mnemonic: 'Inverse of Sexy Move',
    variants: [
      { move: "U R U' R'", label: 'Play Reverse Sexy' }
    ]
  },
  {
    symbol: 'Sledge',
    category: 'triggers',
    name: 'The Sledgehammer',
    algorithm: "R' F R F'",
    direction: 'Right Down, Front Clockwise, Right Up, Front Counter',
    summary: 'A legendary trigger. Inserts an F2L corner-edge pair while flipping the top edges to orient yellow cross early!',
    howToTurn: 'Right wrist down (R\'), right index pushes front down (F), right wrist up (R), right thumb pushes front back up (F\').',
    mnemonic: 'Down, Front, Up, Back',
    variants: [
      { move: "R' F R F'", label: 'Play Sledgehammer' }
    ]
  },
  {
    symbol: 'Hedge',
    category: 'triggers',
    name: 'The Hedgeslammer',
    algorithm: "F R' F' R",
    direction: 'Front Clockwise, Right Down, Front Counter, Right Up',
    summary: 'The inverse of the Sledgehammer. Used to insert pairs from opposite angles cleanly.',
    howToTurn: 'Front down (F), right wrist down (R\'), front up (F\'), right wrist up (R).',
    mnemonic: 'Inverse of Sledgehammer',
    variants: [
      { move: "F R' F' R", label: 'Play Hedgeslammer' }
    ]
  },
  {
    symbol: 'Sune',
    category: 'triggers',
    name: 'The Sune Trigger',
    algorithm: "R U R' U R U2 R'",
    direction: 'Up, Left, Down, Left, Up, 180°, Down',
    summary: 'The most famous OLL algorithm in the world. Orients 3 yellow corners while preserving F2L.',
    howToTurn: 'R U R\' U R, then double-flick U2 with right index + middle finger, then R\'.',
    mnemonic: 'R U R\' U R U2 R\'',
    variants: [
      { move: "R U R' U R U2 R'", label: 'Play Sune (OLL)' }
    ]
  }
];
