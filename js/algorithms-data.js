/**
 * Speedcubing Algorithm Database
 * Digitized from QiYi MoFangGe "Secret Tutorial for Magic Cubes" booklet
 * Augmented with modern speedcubing standards (SpeedCubeDB / J-Perm)
 * Includes 2D Diagram Configurations, Speedcubing Triggers, and Setup Scrambles
 */

export const BEGINNER_LAST_LAYER = [
  {
    step: 'Step 1: Yellow Cross (EO)',
    name: 'Yellow Cross (Edge Orientation)',
    plainGoal: 'Make a yellow + cross on the top face',
    cases: [
      {
        id: 'b-eo-1',
        name: 'Dot Case (No yellow edges on top)',
        type: 'EO',
        badgeTitle: 'Step 1 • Yellow Cross',
        howToHold: 'Hold Yellow on TOP, White on BOTTOM. Any side can face you.',
        whatItDoes: 'Orients the yellow edges in two parts to create a yellow cross.',
        qiyiAlg: "F R U R' U' F' -> U2 -> F R U R' U' F'",
        recommendedAlg: "F (R U R' U') F' f (R U R' U') f'",
        setup: "f U R U' R' f' F U R U' R' F'",
        diagramConfig: {
          top: [0, 0, 0, 0, 1, 0, 0, 0, 0],
          rims: { B: [0, 1, 0], F: [0, 1, 0], L: [0, 1, 0], R: [0, 1, 0] }
        },
        triggers: [
          { name: 'Sexy Move', code: "R U R' U'" },
          { name: 'Wide Sexy', code: "f (R U R' U') f'" }
        ],
        notes: 'Use both six-move parts of this sequence. Check the yellow edges after the full sequence.'
      },
      {
        id: 'b-eo-2',
        name: 'L-Shape (Two yellow edges adjacent)',
        type: 'EO',
        badgeTitle: 'Step 1 • Yellow Cross',
        howToHold: 'Hold Yellow on TOP. Put the L-shape in the TOP-LEFT (like 9:00 on a clock: top and left).',
        whatItDoes: 'Instantly turns the L-shape into a complete Yellow Cross!',
        qiyiAlg: "f R U R' U' f'",
        recommendedAlg: "f (R U R' U') f'",
        setup: "f (U R U' R') f'",
        diagramConfig: {
          top: [0, 1, 0, 1, 1, 0, 0, 0, 0],
          rims: { B: [0, 0, 0], F: [0, 1, 0], L: [0, 0, 0], R: [0, 1, 0] }
        },
        triggers: [{ name: 'Wide FRURUF', code: "f (R U R' U') f'" }],
        notes: 'Use lowercase f (turn both front layers together). In just 6 moves, your cross is done!'
      },
      {
        id: 'b-eo-3',
        name: 'Horizontal Line / Bar (Two yellow edges opposite)',
        type: 'EO',
        badgeTitle: 'Step 1 • Yellow Cross',
        howToHold: 'Hold Yellow on TOP. Keep the yellow line HORIZONTAL (left-to-right, like a minus sign -).',
        whatItDoes: 'Instantly turns the line into a complete Yellow Cross!',
        qiyiAlg: "F R U R' U' F'",
        recommendedAlg: "F (R U R' U') F'",
        setup: "F (U R U' R') F'",
        diagramConfig: {
          top: [0, 0, 0, 1, 1, 1, 0, 0, 0],
          rims: { B: [0, 1, 0], F: [0, 1, 0], L: [0, 0, 0], R: [0, 0, 0] }
        },
        triggers: [{ name: 'FRURUF', code: "F (R U R' U') F'" }],
        notes: 'The famous "FRURUF" move: Front clockwise, sexy move (R U R\' U\'), Front counter-clockwise.'
      }
    ]
  },
  {
    step: 'Step 2: Full Yellow Face (CO)',
    name: 'Yellow Corners Orientation (7 Cases)',
    plainGoal: 'Turn all corners yellow so the whole top face is solid yellow',
    cases: [
      {
        id: 'b-co-sune',
        name: 'Sune (Fish pointing bottom-left)',
        type: 'CO',
        badgeTitle: 'Step 2 • Yellow Face',
        howToHold: 'Hold Yellow on TOP. Put the single yellow corner (fish head) at the FRONT-LEFT. Check that the front-right corner has yellow facing FRONT.',
        whatItDoes: 'Solves all 4 yellow corners! Whole top face becomes solid yellow.',
        qiyiAlg: "R' U U R U R' U R",
        recommendedAlg: "R U R' U R U2 R'",
        setup: "R U2 R' U' R U' R'",
        diagramConfig: {
          top: [0, 1, 0, 1, 1, 1, 1, 1, 0],
          rims: { B: [1, 0, 0], F: [0, 0, 1], L: [0, 0, 0], R: [1, 0, 0] }
        },
        triggers: [{ name: 'Sune Trigger', code: "R U R' U R U2 R'" }],
        notes: 'The most famous algorithm in speedcubing! 1 corner yellow (front-left).'
      },
      {
        id: 'b-co-antisune',
        name: 'Anti-Sune (QiYi Case 2 / Alg 7)',
        type: 'CO',
        badgeTitle: 'Step 2 • Yellow Face',
        howToHold: 'Hold Yellow on TOP. Put the single yellow corner at FRONT-RIGHT. Left-front corner has yellow facing FRONT.',
        whatItDoes: 'Solves all 4 yellow corners! Whole top face becomes solid yellow.',
        qiyiAlg: "U' R U' U' R' U' R U' R'",
        recommendedAlg: "R U2 R' U' R U' R'",
        setup: "R U R' U R U2 R'",
        diagramConfig: {
          top: [0, 1, 0, 1, 1, 1, 0, 1, 1],
          rims: { B: [0, 0, 1], F: [1, 0, 0], L: [0, 0, 1], R: [0, 0, 0] }
        },
        triggers: [{ name: 'Anti-Sune Trigger', code: "R U2 R' U' R U' R'" }],
        notes: 'Mirror of Sune. 1 corner oriented (front-right).'
      },
      {
        id: 'b-co-car',
        name: 'Car / Double Headlights (QiYi Case 3)',
        type: 'CO',
        badgeTitle: 'Step 2 • Yellow Face',
        howToHold: 'Hold Yellow on TOP. Put the matching pairs of yellow headlights facing FRONT and BACK.',
        whatItDoes: 'Triple Sexy Move twists all 4 corners into yellow.',
        qiyiAlg: "Algorithm 6 + Algorithm 7",
        recommendedAlg: "F (R U R' U')3 F'",
        setup: "F (U R U' R')3 F'",
        diagramConfig: {
          top: [0, 1, 0, 1, 1, 1, 0, 1, 0],
          rims: { B: [1, 0, 1], F: [1, 0, 1], L: [0, 0, 0], R: [0, 0, 0] }
        },
        triggers: [{ name: 'Triple Sexy', code: "(R U R' U')3" }],
        notes: '0 corners oriented. Two pairs of headlights on front and back.'
      },
      {
        id: 'b-co-headlights',
        name: 'Headlights / U-Shape (QiYi Case 4)',
        type: 'CO',
        badgeTitle: 'Step 2 • Yellow Face',
        howToHold: 'Hold Yellow on TOP. Put the 2 already-yellow corners in the BACK. Headlights face FRONT.',
        whatItDoes: 'Orients the two remaining corners to make top face completely yellow.',
        qiyiAlg: "Algorithm 6 + Algorithm 6",
        recommendedAlg: "R2 D (R' U2 R) D' (R' U2 R')",
        setup: "R U2 R D R' U2 R D' R2",
        diagramConfig: {
          top: [1, 1, 1, 1, 1, 1, 0, 1, 0],
          rims: { B: [0, 0, 0], F: [1, 0, 1], L: [0, 0, 0], R: [0, 0, 0] }
        },
        triggers: [{ name: 'Keyhole D-Move', code: "R2 D ... D'" }],
        notes: '2 corners oriented in back. The other two corners face front (headlights).'
      },
      {
        id: 'b-co-chameleon',
        name: 'Chameleon / L-Shape (QiYi Case 5)',
        type: 'CO',
        badgeTitle: 'Step 2 • Yellow Face',
        howToHold: 'Hold Yellow on TOP. Put the two yellow corners on the right side. The front-left corner has yellow facing LEFT.',
        whatItDoes: 'Orients corners into a solid yellow face.',
        qiyiAlg: "Algorithm 7 + Algorithm 6",
        recommendedAlg: "r U R' U' r' F R F'",
        setup: "F R' F' r U R U' r'",
        diagramConfig: {
          top: [1, 1, 0, 1, 1, 1, 1, 1, 0],
          rims: { B: [0, 0, 1], F: [0, 0, 0], L: [0, 0, 0], R: [0, 0, 1] }
        },
        triggers: [{ name: 'Wide Sledge', code: "r U R' U' r' F R F'" }],
        notes: '2 corners oriented. The other two face opposite directions.'
      },
      {
        id: 'b-co-bowtie',
        name: 'Bowtie (QiYi Case 6)',
        type: 'CO',
        badgeTitle: 'Step 2 • Yellow Face',
        howToHold: 'Hold Yellow on TOP. Put the front-left corner with yellow facing FRONT.',
        whatItDoes: 'Orients diagonal yellow corners.',
        qiyiAlg: "Algorithm 6 + U' + Algorithm 7",
        recommendedAlg: "F' r U R' U' r' F R",
        setup: "R' F' r U R U' r' F",
        diagramConfig: {
          top: [1, 1, 0, 1, 1, 1, 0, 1, 1],
          rims: { B: [0, 0, 0], F: [1, 0, 0], L: [0, 0, 0], R: [1, 0, 0] }
        },
        triggers: [{ name: 'Inverse Wide Sledge', code: "F' r U R' U' r' F R" }],
        notes: '2 diagonally oriented corners.'
      },
      {
        id: 'b-co-wheel',
        name: 'Wheel / Triple Pi (QiYi Case 7)',
        type: 'CO',
        badgeTitle: 'Step 2 • Yellow Face',
        howToHold: 'Hold Yellow on TOP. Put the two headlights facing LEFT.',
        whatItDoes: 'Orients all corners into solid yellow.',
        qiyiAlg: "Algorithm 7 + U2 + Algorithm 6",
        recommendedAlg: "R U2 (R2 U' R2 U' R2) U2 R",
        setup: "R' U2 R2 U R2 U R2 U2 R'",
        diagramConfig: {
          top: [0, 1, 0, 1, 1, 1, 0, 1, 0],
          rims: { B: [0, 0, 0], F: [1, 0, 1], L: [1, 0, 0], R: [0, 0, 1] }
        },
        triggers: [{ name: 'R2 Swaps', code: "R2 U' R2 U' R2" }],
        notes: '0 corners oriented. One pair of headlights, two corners facing outward.'
      }
    ]
  },
  {
    step: 'Step 6: Permutation of Yellow Corners (2-Look PLL Corner)',
    name: 'Permutation of Yellow Corners',
    cases: [
      {
        id: 'b-cp-headlights',
        name: 'Headlights (Adjacent Corner Swap - T-Perm / Aa-Perm)',
        type: 'CP',
        badgeTitle: 'Step 3 • Match Corners',
        howToHold: 'Hold Yellow on TOP. Look at the sides of the top layer: put matching pair of headlights in the BACK.',
        whatItDoes: 'Swaps the other two corners so ALL 4 corners match their sides!',
        qiyiAlg: "R B' R F F R' B R F F R R (QiYi Alg 8)",
        recommendedAlg: "R' F R' B2 R F' R' B2 R2",
        setup: "R2 B2 R F R' B2 R F' R",
        diagramConfig: {
          pllArrows: [[0, 2, 2, 2], [2, 2, 0, 2]],
          rimColors: {
            L: ['#b71234', '#b71234', '#b71234'], // Solved bar on left
            R: ['#009b48', '#ff5800', '#0046ad'],
            F: ['#b71234', '#009b48', '#009b48'],
            B: ['#0046ad', '#0046ad', '#ff5800']
          }
        },
        triggers: [{ name: 'B2 Double Ring', code: "R' F R' B2 R F' R' B2 R2" }],
        notes: 'Hold headlights in back (or left) and execute. Swaps remaining 2 corners.'
      },
      {
        id: 'b-cp-diag',
        name: 'No Headlights (Diagonal Corner Swap - Y-Perm)',
        type: 'CP',
        badgeTitle: 'Step 3 • Match Corners',
        howToHold: 'Hold Yellow on TOP, any side facing you. (No headlights anywhere).',
        whatItDoes: 'Swaps diagonal corners and creates a pair of headlights for the next turn.',
        qiyiAlg: "Do Alg 8 once -> find headlights -> Alg 8 again",
        recommendedAlg: "F (R U' R' U') (R U R' F') (R U R' U') (R' F R F')",
        setup: "F R' F' R U R U' R' F R U' R' U R U R' F'",
        diagramConfig: {
          pllArrows: [[0, 0, 2, 2, '#f43f5e'], [2, 2, 0, 0, '#f43f5e']],
          rimColors: {
            L: ['#ff5800', '#009b48', '#b71234'],
            R: ['#0046ad', '#0046ad', '#009b48'],
            F: ['#009b48', '#ff5800', '#0046ad'],
            B: ['#b71234', '#b71234', '#ff5800']
          }
        },
        triggers: [
          { name: 'Setup', code: "F R U' R' U'" },
          { name: 'T-Perm Core', code: "R U R' F'" },
          { name: 'Sledgehammer', code: "R' F R F'" }
        ],
        notes: 'Swaps diagonal opposite corners.'
      }
    ]
  },
  {
    step: 'Step 7: Permutation of Yellow Edges (2-Look PLL Edge)',
    name: 'Permutation of Yellow Edges',
    cases: [
      {
        id: 'b-ep-ua',
        name: 'Ua Permutation (Clockwise 3-Edge Cycle)',
        type: 'EP',
        badgeTitle: 'Step 4 • Final Edges',
        howToHold: 'Hold Yellow on TOP. Put the 1 solid completed colored side in the BACK.',
        whatItDoes: 'Cycles the remaining 3 edges clockwise. COMPLETELY SOLVES THE RUBIK\'S CUBE! 🎉',
        qiyiAlg: "R U' R U R U R U' R' U' R2 (QiYi Alg 9)",
        recommendedAlg: "R U' R U R U R U' R' U' R2",
        setup: "R2 U R U R' U' R' U' R' U R'",
        diagramConfig: {
          pllArrows: [[2, 1, 1, 0], [1, 0, 1, 2], [1, 2, 2, 1]],
          rimColors: {
            B: ['#0046ad', '#0046ad', '#0046ad'], // Bar solved on back
            F: ['#009b48', '#ff5800', '#009b48'],
            L: ['#ff5800', '#b71234', '#ff5800'],
            R: ['#b71234', '#009b48', '#b71234']
          }
        },
        triggers: [{ name: 'Right Flow', code: "R U' (R U R U) (R U' R' U') R2" }],
        notes: 'Hold solved bar at the back. Left-front-right edges cycle clockwise.'
      },
      {
        id: 'b-ep-ub',
        name: 'Ub Permutation (Counter-Clockwise 3-Edge Cycle)',
        type: 'EP',
        badgeTitle: 'Step 4 • Final Edges',
        howToHold: 'Hold Yellow on TOP. Put the 1 solid completed colored side in the BACK.',
        whatItDoes: 'Cycles the remaining 3 edges counter-clockwise. COMPLETELY SOLVES THE RUBIK\'S CUBE! 🎉',
        qiyiAlg: "R2 U R U R' U' R' U' R' U R' (QiYi Alg 10)",
        recommendedAlg: "R2 U R U R' U' R' U' R' U R'",
        setup: "R U' R U R U R U' R' U' R2",
        diagramConfig: {
          pllArrows: [[2, 1, 1, 2], [1, 2, 1, 0], [1, 0, 2, 1]],
          rimColors: {
            B: ['#0046ad', '#0046ad', '#0046ad'],
            F: ['#009b48', '#b71234', '#009b48'],
            L: ['#ff5800', '#009b48', '#ff5800'],
            R: ['#b71234', '#ff5800', '#b71234']
          }
        },
        triggers: [{ name: 'Inverse Flow', code: "R2 U (R U R' U') (R' U' R' U R')" }],
        notes: 'Hold solved bar at the back. Edges cycle counter-clockwise.'
      },
      {
        id: 'b-ep-h',
        recommendedAlg: "M2 U M2 U2 M2 U M2",
        setup: "M2 U M2 U2 M2 U M2",
        name: 'H Permutation (Opposite Edge Swap)',
        type: 'EP',
        badgeTitle: 'Step 4 • Final Edges',
        howToHold: 'Hold Yellow on TOP, any side facing you. All 4 edges swap with opposite sides.',
        whatItDoes: 'M-slice double flicks swap all edges. COMPLETELY SOLVES THE CUBE! 🎉',
        diagramConfig: {
          pllArrows: [[0, 1, 2, 1], [2, 1, 0, 1], [1, 0, 1, 2], [1, 2, 1, 0]],
          rimColors: {
            F: ['#009b48', '#0046ad', '#009b48'],
            B: ['#0046ad', '#009b48', '#0046ad'],
            L: ['#ff5800', '#b71234', '#ff5800'],
            R: ['#b71234', '#ff5800', '#b71234']
          }
        },
        triggers: [{ name: 'M-Slice Rhythm', code: "M2 U M2 U2 M2 U M2" }],
        notes: 'Fingertrick gold: double M slice flicks with ring finger!'
      },
      {
        id: 'b-ep-z',
        name: 'Z Permutation (Adjacent Edge Swap)',
        type: 'EP',
        qiyiAlg: "Algorithm 9 + U' + Algorithm 9 + U",
        recommendedAlg: "M' U M2 U M2 U M' U2 M2",
        setup: "M2 U2 M U' M2 U' M2 U' M",
        diagramConfig: {
          pllArrows: [[2, 1, 1, 2], [1, 2, 2, 1], [0, 1, 1, 0], [1, 0, 0, 1]],
          rimColors: {
            F: ['#009b48', '#b71234', '#009b48'],
            R: ['#b71234', '#009b48', '#b71234'],
            B: ['#0046ad', '#ff5800', '#0046ad'],
            L: ['#ff5800', '#0046ad', '#ff5800']
          }
        },
        triggers: [{ name: 'M2 Z-Swap', code: "M' U M2 U M2 U M' U2 M2" }],
        notes: 'Swaps front-right and back-left adjacent edges.'
      }
    ]
  }
];

export const PLL_ALGORITHMS = [
  {
    id: 'pll-t',
    name: 'T Perm',
    category: 'Adjacent Swap',
    qiyiId: '8',
    qiyiAlg: "R U R' U' R' F R2 U' R' U' R U R' F'",
    recommendedAlg: "(R U R' U') (R' F R2 U') (R' U' R U) (R' F')",
    setup: "(R U R' U') (R' F R2 U') (R' U' R U) (R' F')",
    diagramConfig: {
      pllArrows: [[2, 2, 0, 2], [0, 2, 2, 2], [1, 0, 1, 2], [1, 2, 1, 0]],
      rimColors: {
        L: ['#ff5800', '#0046ad', '#ff5800'], // Headlights on left
        R: ['#b71234', '#009b48', '#b71234'], // Headlights on right
        F: ['#009b48', '#ff5800', '#b71234'],
        B: ['#0046ad', '#b71234', '#0046ad']
      }
    },
    triggers: [
      { name: 'Sexy Move', code: "R U R' U'" },
      { name: 'F-Setup', code: "R' F R2 U'" },
      { name: 'Reverse Sexy', code: "R' U' R U" },
      { name: 'Sledge End', code: "R' F'" }
    ],
    arrows: '2 corners + 2 edges swap',
    recognition: 'Headlights on right, headlights on left, 2 opposing bars',
    speedTip: 'The fundamental benchmark PLL for speedcubers. Practice until sub-1.2s.'
  },
  {
    id: 'pll-jb',
    name: 'Jb Perm',
    category: 'Adjacent Swap',
    qiyiId: '11',
    qiyiAlg: "R U R' F' R U R' U' R' F R2 U' R'",
    recommendedAlg: "(R U R' F') (R U R' U') (R' F R2 U' R')",
    setup: "R U R2 F' R U R U' R' F R U' R'",
    diagramConfig: {
      pllArrows: [[0, 0, 2, 0], [2, 0, 0, 0], [1, 0, 2, 1], [2, 1, 1, 0]],
      rimColors: {
        R: ['#b71234', '#b71234', '#b71234'], // Solved bar on right
        F: ['#009b48', '#ff5800', '#009b48'], // Headlights on front
        L: ['#ff5800', '#009b48', '#0046ad'],
        B: ['#0046ad', '#0046ad', '#ff5800']
      }
    },
    triggers: [
      { name: 'Trigger 1', code: "R U R' F'" },
      { name: 'Sexy Move', code: "R U R' U'" },
      { name: 'T-Perm End', code: "R' F R2 U' R'" }
    ],
    arrows: '1x3 bar on right',
    recognition: 'Full bar on right, headlights on front (fastest PLL in speedcubing!)',
    speedTip: 'Fastest PLL for most cubers! (Sub-0.9s achievable).'
  },
  {
    id: 'pll-ja',
    name: 'Ja Perm',
    category: 'Adjacent Swap',
    qiyiId: '10',
    qiyiAlg: "R' U L' U2 R U' R' U2 R L",
    recommendedAlg: "x R2 F R F' R U2 r' U r U2 x'",
    setup: "x U2 r' U' r U2 R' F R' F' R2 x'",
    diagramConfig: {
      pllArrows: [[0, 2, 2, 2], [2, 2, 0, 2]],
      rimColors: {
        L: ['#ff5800', '#ff5800', '#ff5800'], // Solved bar on left
        B: ['#0046ad', '#009b48', '#0046ad']
      }
    },
    triggers: [{ name: 'x-rotation Alg', code: "x R2 F R F' R U2 ..." }],
    arrows: '1x3 bar on left, corner swap on right',
    recognition: 'Full bar on left, headlights on back',
    speedTip: 'Left-handed counterpart or x-rotation alg.'
  },
  {
    id: 'pll-ua',
    name: 'Ua Perm',
    category: 'Edges Only',
    qiyiId: '1',
    qiyiAlg: "R U' R U R U R U' R' U' R2",
    recommendedAlg: "R U' (R U R U) (R U' R' U') R2",
    setup: "R2 U R U R' U' R' U' R' U R'",
    diagramConfig: {
      pllArrows: [[2, 1, 1, 0], [1, 0, 1, 2], [1, 2, 2, 1]],
      rimColors: {
        B: ['#0046ad', '#0046ad', '#0046ad'],
        F: ['#009b48', '#ff5800', '#009b48']
      }
    },
    triggers: [{ name: 'Cycle', code: "R U' R U R U R U' R' U' R2" }],
    arrows: '3 edges cycle CW',
    recognition: '1 solved bar on back + front-right edge matches front center',
    speedTip: 'Continuous right-hand flow. No regrip required.'
  },
  {
    id: 'pll-ub',
    name: 'Ub Perm',
    category: 'Edges Only',
    qiyiId: '2',
    qiyiAlg: "R2 U R U R' U' R' U' R' U R'",
    recommendedAlg: "R2 U (R U R' U') (R' U' R' U R')",
    setup: "R U' R U R U R U' R' U' R2",
    diagramConfig: {
      pllArrows: [[2, 1, 1, 2], [1, 2, 1, 0], [1, 0, 2, 1]],
      rimColors: {
        B: ['#0046ad', '#0046ad', '#0046ad'],
        F: ['#009b48', '#b71234', '#009b48']
      }
    },
    triggers: [{ name: 'Reverse Cycle', code: "R2 U R U R' U' R' U' R' U R'" }],
    arrows: '3 edges cycle CCW',
    recognition: '1 solved bar on back + front-left edge matches front center',
    speedTip: 'Start with index push or right thumb push.'
  },
  {
    id: 'pll-h',
    name: 'H Perm',
    category: 'Edges Only',
    qiyiId: '4',
    qiyiAlg: "M' U M'2 U2 M' U2 M'2 U'",
    recommendedAlg: "(M2 U) (M2 U2) (M2 U) M2",
    setup: "M2 U M2 U2 M2 U M2",
    diagramConfig: {
      pllArrows: [[0, 1, 2, 1], [2, 1, 0, 1], [1, 0, 1, 2], [1, 2, 1, 0]]
    },
    triggers: [{ name: 'Double M-Slice', code: "M2 U M2 U2 M2 U M2" }],
    arrows: 'Opposite edge pairs swap',
    recognition: 'All 4 sides have opposite color edge from corners',
    speedTip: 'One of the fastest PLLs. Can be executed in under 0.8s.'
  },
  {
    id: 'pll-z',
    name: 'Z Perm',
    category: 'Edges Only',
    qiyiId: '3',
    qiyiAlg: "M2 U M2 U M' U2 M2 U2 M'",
    recommendedAlg: "M' U (M2 U M2 U) M' U2 M2",
    setup: "M2 U2 M U' M2 U' M2 U' M",
    diagramConfig: {
      pllArrows: [[2, 1, 1, 2], [1, 2, 2, 1], [0, 1, 1, 0], [1, 0, 0, 1]]
    },
    triggers: [{ name: 'M-Slice Swap', code: "M' U M2 U M2 U M' U2 M2" }],
    arrows: 'Adjacent edge pairs swap',
    recognition: 'Checkered adjacent colors, 0 solved bars',
    speedTip: 'Use ring-middle double flick for M2 from the bottom.'
  },
  {
    id: 'pll-y',
    name: 'Y Perm',
    category: 'Diagonal Swap',
    qiyiId: '15',
    qiyiAlg: "F R U' R' U' R U R' F' R U R' U' R' F R F'",
    recommendedAlg: "F (R U' R' U') (R U R' F') (R U R' U') (R' F R F')",
    setup: "F R' F' R U R U' R' F R U' R' U R U R' F'",
    diagramConfig: {
      pllArrows: [[0, 0, 2, 2, '#f43f5e'], [2, 2, 0, 0, '#f43f5e']]
    },
    triggers: [
      { name: 'Setup', code: "F R U' R' U'" },
      { name: 'T-Perm Front', code: "R U R' F'" },
      { name: 'Sexy Move', code: "R U R' U'" },
      { name: 'Sledgehammer', code: "R' F R F'" }
    ],
    arrows: 'Diagonal corners swap + adjacent edges swap',
    recognition: 'Headlights on corner of block, no 2-side headlights',
    speedTip: 'Made of two standard speedcubing triggers: (FRURUF variant) + (Sledgehammer).'
  },
  {
    id: 'pll-f',
    name: 'F Perm',
    category: 'Adjacent Swap',
    qiyiId: '9',
    qiyiAlg: "R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R",
    recommendedAlg: "(R' U' F') (R U R' U') (R' F R2 U' R') (U' R U R' U R)",
    setup: "R' U' R U' R' U R U R2 F' R U R U' R' F U R",
    diagramConfig: {
      pllArrows: [[0, 0, 2, 0], [2, 0, 0, 0]],
      rimColors: {
        L: ['#ff5800', '#ff5800', '#ff5800'],
        R: ['#b71234', '#009b48', '#b71234']
      }
    },
    triggers: [
      { name: 'Setup', code: "R' U' F'" },
      { name: 'T-Perm Core', code: "R U R' U' R' F R2 U' R'" },
      { name: 'Finish', code: "U' R U R' U R" }
    ],
    arrows: '1 full solved side, opposite side has headlights',
    recognition: 'Full bar on left, headlights on right',
    speedTip: 'T-Perm setup variation (starts with setup R\' U\' F\').'
  },
  {
    id: 'pll-ra',
    name: 'Ra Perm',
    category: 'Adjacent Swap',
    qiyiId: '12',
    qiyiAlg: "R U' R' U' R U R D R' U' R D' R' U2 R'",
    recommendedAlg: "(R U R' F') (R U2 R' U2) (R' F R U) (R U2 R')",
    setup: "R U2 R' U' R' F' R U2 R U2 R' F R U' R'",
    diagramConfig: {
      pllArrows: [[0, 2, 2, 2], [2, 2, 0, 2]]
    },
    triggers: [
      { name: 'Start', code: "R U R' F'" },
      { name: 'U2 inserts', code: "R U2 R' U2" }
    ],
    arrows: 'Headlights on left + 2x1 block on front-right',
    recognition: 'Headlights on left, block on front',
    speedTip: 'Modern F\' insertion avoids awkward D moves.'
  },
  {
    id: 'pll-rb',
    name: 'Rb Perm',
    category: 'Adjacent Swap',
    qiyiId: '13',
    qiyiAlg: "R' U2 R U2 R' F R U R' U' R' F' R2",
    recommendedAlg: "(R' U2 R' D') (R U' R' D) (R U R U' R' U' R)",
    setup: "R' U R U R' U' R' D' R U R' D R U2 R",
    diagramConfig: {
      pllArrows: [[0, 2, 2, 2], [2, 2, 0, 2]]
    },
    triggers: [{ name: 'Keyhole D', code: "R' U2 R' D' R U' R' D" }],
    arrows: 'Headlights on left + 2x1 block on back-right',
    recognition: 'Headlights on left, block on back',
    speedTip: 'Keep right wrist stable during U2.'
  },
  {
    id: 'pll-aa',
    name: 'Aa Perm',
    category: 'Adjacent Corners',
    qiyiId: '5',
    qiyiAlg: "x' R2 D2 R' U' R D2 R' U R'",
    recommendedAlg: "x (R' U R') D2 (R U' R') D2 R2 x'",
    setup: "x R2 D2 R U R' D2 R U' R x'",
    diagramConfig: {
      pllArrows: [[0, 0, 2, 0], [2, 0, 2, 2], [2, 2, 0, 0]]
    },
    triggers: [{ name: 'D2 Flicks', code: "x R' U R' D2 R U' R' D2 R2 x'" }],
    arrows: '3 corners cycle',
    recognition: 'Headlights on left, solved 2x1 block on back-right',
    speedTip: 'Use left ring finger for D2 double flick.'
  },
  {
    id: 'pll-ab',
    name: 'Ab Perm',
    category: 'Adjacent Corners',
    qiyiId: '6',
    qiyiAlg: "x' R U' R D2 R' U R D2 R2",
    recommendedAlg: "x R2 D2 (R U R') D2 (R U' R) x'",
    setup: "x R' U R' D2 R U' R' D2 R2 x'",
    diagramConfig: {
      pllArrows: [[0, 0, 2, 2], [2, 2, 2, 0], [2, 0, 0, 0]]
    },
    triggers: [{ name: 'D2 Mirror', code: "x R2 D2 R U R' D2 R U' R x'" }],
    arrows: '3 corners cycle',
    recognition: 'Headlights on left, solved 2x1 block on front-right',
    speedTip: 'Mirror of Aa perm.'
  },
  {
    id: 'pll-e',
    name: 'E Perm',
    category: 'Diagonal Corners',
    qiyiId: '7',
    qiyiAlg: "x' R U' R' D R U R' D' R U R' D R U' R' D' x",
    recommendedAlg: "x' (R U' R' D) (R U R' D') (R U R' D) (R U' R' D') x",
    setup: "x' D R U R' D' R U' R' D R U' R' D' R U R' x",
    diagramConfig: {
      pllArrows: [[0, 0, 0, 2, '#f43f5e'], [0, 2, 0, 0, '#f43f5e'], [2, 0, 2, 2, '#f43f5e'], [2, 2, 2, 0, '#f43f5e']]
    },
    triggers: [{ name: 'Rhythm Sexy-D', code: "(R U' R' D) (R U R' D')" }],
    arrows: 'Corners swap diagonally',
    recognition: 'No headlights on any side, edges match adjacent centers',
    speedTip: 'Rhythm: (sexy-D) (reverse-sexy-D\') pattern.'
  },
  {
    id: 'pll-v',
    name: 'V Perm',
    category: 'Diagonal Swap',
    qiyiId: '14',
    qiyiAlg: "R' U R' U' y R' F' R2 U' R' U R' F R F",
    recommendedAlg: "(R' U R' U') y (R' F' R2 U') (R' U R' F) (R F)",
    setup: "F' R' F' R U' R U R2 F R y' U R U' R",
    diagramConfig: {
      pllArrows: [[0, 0, 2, 2, '#f43f5e'], [2, 2, 0, 0, '#f43f5e']]
    },
    triggers: [{ name: 'y-Rotation Slice', code: "R' U R' U' y R' F' R2 U' ..." }],
    arrows: '2x2 block solved, diagonal corners swap',
    recognition: '2x2 block solved on top-left',
    speedTip: 'Smooth y rotation during the first 4 moves.'
  },
  {
    id: 'pll-na',
    name: 'Na Perm',
    category: 'Diagonal Swap',
    qiyiId: '16',
    qiyiAlg: "R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'",
    recommendedAlg: "(R U R' U) (R U R' F') (R U R' U') (R' F R2 U' R') (U2 R U' R')",
    setup: "R U R' U2 R U R2 F' R U R U' R' F R U' R' U' R U' R'",
    diagramConfig: {
      pllArrows: [[0, 0, 2, 2, '#f43f5e'], [2, 2, 0, 0, '#f43f5e']]
    },
    triggers: [{ name: 'J-Perm Extension', code: "R U R' U ... Jb Perm ... U2 R U' R'" }],
    arrows: 'Opposite corners & edges swap',
    recognition: 'Two solved 2x1 bars on opposite sides (left & right)',
    speedTip: 'Recognizable by double bars. J-perm extension.'
  },
  {
    id: 'pll-nb',
    name: 'Nb Perm',
    category: 'Diagonal Swap',
    qiyiId: '17',
    qiyiAlg: "R' U R U' R' F' U' F R U R' F R' F' R U' R",
    recommendedAlg: "(R' U R U') (R' F' U' F) (R U R' F) (R' F' R U' R)",
    setup: "R' U R' F R F' R U' R' F' U F R U R' U' R",
    diagramConfig: {
      pllArrows: [[0, 2, 2, 0, '#f43f5e'], [2, 0, 0, 2, '#f43f5e']]
    },
    triggers: [{ name: 'Nb Sledge combo', code: "R' U R U' R' F' U' F ..." }],
    arrows: 'Opposite corners & edges swap',
    recognition: 'Two solved 2x1 bars on front & back',
    speedTip: 'Double bars on front & back.'
  },
  {
    id: 'pll-ga',
    name: 'Ga Perm',
    category: 'G Perms',
    qiyiId: '18',
    qiyiAlg: "R2 U R' U R' U' R U' R2 D U' R' U R D'",
    recommendedAlg: "R2 U (R' U R' U') (R U' R2) D (U' R' U R) D'",
    setup: "D R' U' R U D' R2 U R' U R U' R U' R2",
    diagramConfig: {
      pllArrows: [[0, 0, 2, 0], [2, 0, 2, 2], [2, 2, 0, 0]]
    },
    triggers: [{ name: 'D-Layer Slide', code: "R2 U R' U R' U' R U' R2 D ..." }],
    arrows: 'Headlights on left, 2x1 block on front-right',
    recognition: 'Headlights on left, block in front',
    speedTip: 'All 4 G perms have headlights on the left. Learn the block position!'
  },
  {
    id: 'pll-gb',
    name: 'Gb Perm',
    category: 'G Perms',
    qiyiId: '19',
    qiyiAlg: "R' U' R U D' R2 U R' U R U' R U' R2 D",
    recommendedAlg: "(R' U' R) U D' (R2 U R' U) (R U' R U' R2) D",
    setup: "D' R2 U R' U R' U' R U' R2 D U' R' U R",
    diagramConfig: {
      pllArrows: [[0, 0, 2, 0], [2, 0, 2, 2], [2, 2, 0, 0]]
    },
    triggers: [{ name: 'Start', code: "R' U' R U D'" }],
    arrows: 'Headlights on left, 2x1 block on back-right',
    recognition: 'Headlights on left, block on right',
    speedTip: 'Headlights on left, 2x1 block on the right.'
  },
  {
    id: 'pll-gc',
    name: 'Gc Perm',
    category: 'G Perms',
    qiyiId: '20',
    qiyiAlg: "R2 U' R U' R U R' U R2 D' U R U' R' D",
    recommendedAlg: "R2 U' (R U' R U) (R' U R2) D' (U R U' R') D",
    setup: "D' R U R' U' D R2 U' R U' R' U R' U R2",
    diagramConfig: {
      pllArrows: [[0, 0, 2, 2], [2, 2, 2, 0], [2, 0, 0, 0]]
    },
    triggers: [{ name: 'D-Counter Slide', code: "R2 U' R U' R U R' U R2 D' ..." }],
    arrows: 'Headlights on left, 2x1 block on front-left',
    recognition: 'Headlights on left, block on back',
    speedTip: 'Headlights on left, 2x1 block on the back.'
  },
  {
    id: 'pll-gd',
    name: 'Gd Perm',
    category: 'G Perms',
    qiyiId: '21',
    qiyiAlg: "R U R' U' D R2 U' R U' R' U R' U R2 D'",
    recommendedAlg: "(R U R' U') D (R2 U' R U') (R' U R' U R2) D'",
    setup: "D R2 U' R U' R U R' U R2 D' U R U' R'",
    diagramConfig: {
      pllArrows: [[0, 0, 2, 2], [2, 2, 2, 0], [2, 0, 0, 0]]
    },
    triggers: [
      { name: 'Sexy Move Start', code: "R U R' U'" },
      { name: 'D-Slide', code: "D R2 U' R U' ..." }
    ],
    arrows: 'Headlights on left, 2x1 block on back-left',
    recognition: 'Headlights on left, block in front-left',
    speedTip: 'Headlights on left, 2x1 block attached to front headlight.'
  }
];


export const WHITE_CROSS_CASES = [
  // ==========================================
  // TIER 1: ABSOLUTE BEGINNER (The Daisy Method)
  // ==========================================
  {
    id: "cross-beg-1",
    name: "Petal from the Front-Left Slot",
    tier: "beginner",
    group: "Absolute Beginner • The Daisy Method",
    badge: "BEGINNER • STEP 1",
    qiyiId: "Daisy Step 1A",
    recommendedAlg: "F",
    alg: "F",
    qiyiAlg: "F",
    intuition: "Match the preview: white faces LEFT on the front-left edge. Turn F to lift it to the top.",
    setup: "F2 R2 B2 L2 F'",
    howToHold: "Yellow on top, white center on bottom. Match the preview: white faces LEFT on the front-left edge. Turn F to lift it to the top.",
    whatItDoes: "Completes the daisy in this prepared example. Follow the lesson to build one on your own scramble."
  },
  {
    id: "cross-beg-2",
    name: "Petal from the Bottom Layer",
    tier: "beginner",
    group: "Absolute Beginner • The Daisy Method",
    badge: "BEGINNER • STEP 1",
    qiyiId: "Daisy Step 1B",
    recommendedAlg: "F2",
    alg: "F2",
    qiyiAlg: "F2",
    intuition: "Match the preview: the bottom-front edge has white facing down. F2 lifts it beside the yellow center.",
    setup: "F2 R2 B2 L2 F2",
    howToHold: "Yellow on top, white center on bottom. Match the preview: the bottom-front edge has white facing down. F2 lifts it beside the yellow center.",
    whatItDoes: "Completes the daisy in this prepared example. Follow the lesson to build one on your own scramble."
  },
  {
    id: "cross-beg-3",
    name: "Lift a Flipped Bottom Edge",
    tier: "beginner",
    group: "Absolute Beginner • The Daisy Method",
    badge: "BEGINNER • STEP 1",
    qiyiId: "Daisy Step 1C",
    recommendedAlg: "F' U' R",
    alg: "F' U' R",
    qiyiAlg: "F' U' R",
    intuition: "Match the preview: white faces FRONT on the bottom-front edge. F′ moves it right, U′ makes space, and R lifts it.",
    setup: "F2 R2 B2 L2 R' U F",
    howToHold: "Yellow on top, white center on bottom. Match the preview: white faces FRONT on the bottom-front edge. F′ moves it right, U′ makes space, and R lifts it.",
    whatItDoes: "Completes the daisy in this prepared example. Follow the lesson to build one on your own scramble."
  },
  {
    id: "cross-beg-4",
    name: "Lift, Store, Restore",
    tier: "beginner",
    group: "Absolute Beginner • The Daisy Method",
    badge: "BEGINNER • STEP 1",
    qiyiId: "Daisy Step 1D",
    recommendedAlg: "R U R'",
    alg: "R U R'",
    qiyiAlg: "R U R'",
    intuition: "Match the preview: white faces FRONT on the front-right edge. R lifts it, U stores it, and R′ restores the right face.",
    setup: "F2 R2 B2 L2 R U' R'",
    howToHold: "Yellow on top, white center on bottom. Match the preview: white faces FRONT on the front-right edge. R lifts it, U stores it, and R′ restores the right face.",
    whatItDoes: "Completes the daisy in this prepared example. Follow the lesson to build one on your own scramble."
  },
  {
    id: "cross-beg-5",
    name: "Drop an Aligned Daisy",
    tier: "beginner",
    group: "Absolute Beginner • The Daisy Method",
    badge: "BEGINNER • STEP 2",
    qiyiId: "Booklet Step 1 Complete",
    recommendedAlg: "F2 R2 B2 L2",
    alg: "F2 R2 B2 L2",
    qiyiAlg: "F2 R2 B2 L2",
    intuition: "In this example the daisy petals already match their side centers. Turn each side twice. On other scrambles, align each petal with U first.",
    setup: "L2 B2 R2 F2",
    howToHold: "Yellow on top, white center on bottom. In this example the daisy petals already match their side centers. Turn each side twice. On other scrambles, align each petal with U first.",
    whatItDoes: "Drops the four aligned petals to form the bottom cross."
  },

  // ==========================================
  // TIER 2: INTERMEDIATE (Direct Bottom Cross)
  // ==========================================
  {
    id: "cross-int-1",
    name: "Direct 1-Move Insert (Skip the Daisy!)",
    tier: "intermediate",
    group: "Intermediate • Direct Bottom Cross",
    badge: "INTERMEDIATE • RULE 1",
    qiyiId: "Bottom Cross 1",
    recommendedAlg: "F",
    alg: "F",
    qiyiAlg: "Direct 1-Move Bottom Insert",
    intuition: "INTERMEDIATE SECRET: Stop building the Daisy! Keep White on BOTTOM from second 0. Any white edge in the middle layer can be solved directly onto bottom in 1 turn (F, R', L, or B).",
    setup: "F'",
    howToHold: "Hold White on BOTTOM, Green on FRONT. White edge is in the middle-left layer.",
    whatItDoes: "Solves white edge directly into the bottom cross in 1 single turn."
  },
  {
    id: "cross-int-2",
    name: "Top Layer Flipped Edge (F' U L')",
    tier: "intermediate",
    group: "Intermediate • Direct Bottom Cross",
    badge: "INTERMEDIATE • RULE 2",
    qiyiId: "Bottom Cross 2",
    recommendedAlg: "F' U L'",
    alg: "F' U L'",
    qiyiAlg: "F' U L' or U' R' F R",
    intuition: "White edge is on top, but white faces FRONT (not top). Don't do a slow 4-move beginner routine: turn F' to orient into middle, U to clear slot, and L' to drop straight into bottom cross!",
    setup: "L U' F",
    howToHold: "Hold White on BOTTOM. White edge is in top-front slot with white facing front.",
    whatItDoes: "Directly solves a flipped top edge onto bottom in just 3 moves."
  },
  {
    id: "cross-int-3",
    name: "Inverted Bottom Edge (Flipped in Cross Slot)",
    tier: "intermediate",
    group: "Intermediate • Direct Bottom Cross",
    badge: "INTERMEDIATE • RULE 3",
    qiyiId: "Bottom Cross 3",
    recommendedAlg: "F' D R' D'",
    alg: "F' D R' D'",
    qiyiAlg: "F' D R' D' (Flip in place)",
    intuition: "The edge is already in the right spot on the bottom cross, but flipped upside down! Do F' to lift to middle, D to slide target slot under right face, R' to insert white, and D' to restore the cross.",
    setup: "D R D' F",
    howToHold: "Hold White on BOTTOM, with the flipped edge facing you in the bottom-front slot.",
    whatItDoes: "Flips an inverted bottom cross edge in 4 smooth moves."
  },
  {
    id: "cross-int-4",
    name: "Keyhole Turntable (Preserving Solved Edges)",
    tier: "intermediate",
    group: "Intermediate • Direct Bottom Cross",
    badge: "INTERMEDIATE • RULE 4",
    qiyiId: "Bottom Cross 4",
    recommendedAlg: "D R' F D'",
    alg: "D R' F D'",
    qiyiAlg: "D R' F D' (Keyhole protect)",
    intuition: "When inserting an edge would break an already-solved cross piece: turn the D layer like a turntable to move solved pieces out of the way, insert with R' F, then restore D'!",
    setup: "D F' R D'",
    howToHold: "Hold White on BOTTOM. Use the bottom layer as a turntable to receive incoming edges.",
    whatItDoes: "Solves cross edges safely without disturbing previously solved pieces."
  },
  {
    id: "cross-int-5",
    name: "Adjacent Swapped Edges Fix (R2 D' R2 D R2)",
    tier: "intermediate",
    group: "Intermediate • Direct Bottom Cross",
    badge: "INTERMEDIATE • RULE 5",
    qiyiId: "Bottom Cross 5",
    recommendedAlg: "R2 D' R2 D R2",
    alg: "R2 D' R2 D R2",
    qiyiAlg: "R2 D' R2 D R2 (Swap neighbors)",
    intuition: "The cross is on the bottom, but two neighboring edges (e.g. Front and Right) are swapped. This 5-move sequence swaps them instantly without touching the other 2 edges.",
    setup: "R2 D' R2 D R2",
    howToHold: "Hold White on BOTTOM. Put the two swapped edges at FRONT and RIGHT.",
    whatItDoes: "Swaps two adjacent cross edges into their correct positions."
  },
  {
    id: "cross-int-6",
    name: "Opposite Swapped Edges Fix (R2 L2 D2 R2 L2)",
    tier: "intermediate",
    group: "Intermediate • Direct Bottom Cross",
    badge: "INTERMEDIATE • RULE 6",
    qiyiId: "Bottom Cross 6",
    recommendedAlg: "R2 L2 D2 R2 L2",
    alg: "R2 L2 D2 R2 L2",
    qiyiAlg: "R2 L2 D2 R2 L2 (Swap opposites)",
    intuition: "Opposite cross edges (e.g. Front and Back, or Left and Right) are swapped on the bottom. Eject both sides, spin bottom 180° (D2), and drop both sides back down!",
    setup: "R2 L2 D2 R2 L2",
    howToHold: "Hold White on BOTTOM. Put the swapped opposite edges at LEFT and RIGHT.",
    whatItDoes: "Swaps opposite cross edges cleanly."
  },

  // ==========================================
  // TIER 3: PRO & ADVANCED (Sub-20 & Sub-10 CFOP)
  // ==========================================
  {
    id: "cross-pro-1",
    name: "The BOOG Rule (Relative Color Order)",
    tier: "pro",
    group: "Pro & Advanced • Sub-20 CFOP",
    badge: "PRO CFOP • RULE 1",
    qiyiId: "Pro Rule 1",
    recommendedAlg: "R F2 L' B2 D",
    alg: "R F2 L' B2 D",
    qiyiAlg: "Place relative to each other, D to align",
    intuition: "PRO SPEED SECRET: Never match edges with centers immediately! Remember the clockwise order around White: Blue ➔ Orange ➔ Green ➔ Red (B-O-O-G). Place edges in relative order, then ONE D move solves all 4 centers simultaneously!",
    setup: "D' B2 L F2 R'",
    howToHold: "Hold White on BOTTOM. Place edges in relative order, then finish with D or D'.",
    whatItDoes: "Saves 4 to 8 moves per solve. The hallmark technique of sub-20 and sub-10 cubers."
  },
  {
    id: "cross-pro-2",
    name: "15-Second Inspection Full Cross Plan",
    tier: "pro",
    group: "Pro & Advanced • Sub-20 CFOP",
    badge: "PRO CFOP • RULE 2",
    qiyiId: "Pro Rule 2",
    recommendedAlg: "R' F R D' F2",
    alg: "R' F R D' F2",
    qiyiAlg: "Plan all 4 edges 100% blind before move 1",
    intuition: "Every random scramble has a White Cross solvable in 8 moves or fewer (average: 5.8 moves). In speedcubing, you never turn the cube until all 4 edges are planned in your head. Close your eyes and execute!",
    setup: "F2 D R' F' R",
    howToHold: "Hold White on BOTTOM. Plan all moves in head during inspection.",
    whatItDoes: "Executes cross in under 2.5 seconds with zero pauses into F2L."
  },
  {
    id: "cross-pro-3",
    name: "Opposite Insertion (Skip Center Matching)",
    tier: "pro",
    group: "Pro & Advanced • Sub-20 CFOP",
    badge: "PRO CFOP • RULE 3",
    qiyiId: "Pro Rule 3",
    recommendedAlg: "L' R F2 L R'",
    alg: "L' R F2 L R'",
    qiyiAlg: "L' R F2 L R' (Opposite pair)",
    intuition: "If you see opposite color edges (e.g. Blue and Green), place them opposite each other across the white center without caring which center they touch yet. Alignment happens naturally.",
    setup: "R L' F2 R' L",
    howToHold: "Hold White on BOTTOM. Opposite edges inserted across each other.",
    whatItDoes: "Pairs opposite cross edges simultaneously in 5 moves."
  },
  {
    id: "cross-pro-4",
    name: "Cross + 1 / X-Cross (Track First F2L Pair)",
    tier: "pro",
    group: "Pro & Advanced • Sub-20 CFOP",
    badge: "PRO CFOP • RULE 4",
    qiyiId: "Pro Rule 4",
    recommendedAlg: "D' R' F R D",
    alg: "D' R' F R D",
    qiyiAlg: "Track first F2L pair during cross inspection",
    intuition: "The secret to Sub-12 and Sub-10 solves. While planning your 5-6 cross moves during inspection, track where the first F2L corner and edge will land so there is ZERO pause between Cross and F2L!",
    setup: "D' R' F' R D",
    howToHold: "Hold White on BOTTOM. Eyes track target F2L pair while cross executes.",
    whatItDoes: "Eliminates the cross-to-F2L transition pause, saving 2 to 3 seconds."
  },
  {
    id: "cross-pro-5",
    name: "Ergonomic Fingertricks (Zero-Regrip D Flicks)",
    tier: "pro",
    group: "Pro & Advanced • Sub-20 CFOP",
    badge: "PRO CFOP • RULE 5",
    qiyiId: "Pro Rule 5",
    recommendedAlg: "R' D F D' R",
    alg: "R' D F D' R",
    qiyiAlg: "Left & Right ring finger D flicks",
    intuition: "Never regrip or rotate the cube for bottom turns. Use your LEFT ring finger to flick D and your RIGHT ring finger to flick D'. Your hands stay in home grip, ready to attack F2L instantly.",
    setup: "R' D F' D' R",
    howToHold: "Hold White on BOTTOM with standard speedcube grip. Thumbs on front, index fingers ready on top.",
    whatItDoes: "Increases turns per second (TPS) and keeps lookahead crystal clear."
  }
];

export const F2L_CASES = [
  // --- Beginner Layer-by-Layer F2L (QiYi Booklet Steps 2 & 3) ---
  {
    id: 'f2l-b-corner',
    name: 'Beginner Step 2: 4 White Corners (Sexy Move Repeat)',
    group: 'Beginner Layer-by-Layer',
    qiyiId: 'Booklet Step 2',
    recommendedAlg: "(R U R' U')",
    alg: "(R U R' U')",
    qiyiAlg: "Algorithm 1: R U R' U' (Repeat 1 to 5 times)",
    intuition: "Place the corner in the top layer directly above its slot. Do (R U R' U'): 1 time if white faces right, 3 times if white faces front, 5 times if white faces up!",
    setup: "(U R U' R')",
    howToHold: "Hold White on BOTTOM. Put corner directly above its target slot at Front-Right.",
    whatItDoes: "Solves 1 white corner piece on the bottom layer."
  },
  {
    id: 'f2l-b-edge-right',
    name: 'Beginner Step 3: Middle Edge to Right Slot',
    group: 'Beginner Layer-by-Layer',
    qiyiId: 'Booklet Step 3 Case 1',
    recommendedAlg: "U (R U' R') U' (F' U F)",
    alg: "U (R U' R') U' (F' U F)",
    qiyiAlg: "Algorithm 2: U R U' R' U' F' U F",
    intuition: "Edge on top matches Front center color, needs to go into Front-Right slot. Turn U to move it away, open right slot (R U' R'), align, and insert (F' U F)!",
    setup: "F' U' F U R U R' U'",
    howToHold: "Hold White on BOTTOM. Match top edge with front center. Target slot is on your RIGHT.",
    whatItDoes: "Inserts edge into the right middle layer slot without disturbing the solved white face."
  },
  {
    id: 'f2l-b-edge-left',
    name: 'Beginner Step 3: Middle Edge to Left Slot',
    group: 'Beginner Layer-by-Layer',
    qiyiId: 'Booklet Step 3 Case 2',
    recommendedAlg: "U' (L' U L) U (F U' F')",
    alg: "U' (L' U L) U (F U' F')",
    qiyiAlg: "Algorithm 3: R' U' R' U' R' U R U R or U' L' U L U F U' F'",
    intuition: "Edge on top matches Front center color, needs to go into Front-Left slot. Mirror of Case 1: U' (L' U L) U (F U' F')!",
    setup: "F U F' U' L' U' L U",
    howToHold: "Hold White on BOTTOM. Match top edge with front center. Target slot is on your LEFT.",
    whatItDoes: "Inserts edge into the left middle layer slot cleanly."
  },
  {
    id: 'f2l-b-edge-eject',
    name: 'Beginner Step 3: Edge Stuck in Middle Layer (Eject)',
    group: 'Beginner Layer-by-Layer',
    qiyiId: 'Booklet Step 3 Case 3',
    recommendedAlg: "(R U' R') U' (F' U F)",
    alg: "(R U' R') U' (F' U F)",
    qiyiAlg: "Algorithm 4: Eject with Alg 2 or Alg 3, then insert",
    intuition: "If edge is stuck in middle layer upside down: perform Algorithm 2 once to replace it with a yellow edge. Now it is in the top layer! Then insert it properly.",
    setup: "F' U' F U R U R'",
    howToHold: "Hold White on BOTTOM with stuck edge in front-right slot.",
    whatItDoes: "Ejects the trapped edge into the top layer."
  },

  // --- Complete 41 CFOP F2L Cases (QiYi Booklet Pages 12 & 13) ---
  {
    id: 'f2l-1',
    name: 'QiYi 1: Basic Insert (Right Slot, Matched Pair)',
    group: 'Easy Inserts (Cases 1-4)',
    qiyiId: '1',
    recommendedAlg: "U' (R U R')",
    alg: "U' R U R'",
    qiyiAlg: "y' (U' R' U R)",
    intuition: "Corner and edge are already paired up on top. Turn U' to align with slot, then R U R' to insert!",
    setup: "R U' R' U",
    triggers: [{ name: 'Basic Insert', code: "U' R U R'" }]
  },
  {
    id: 'f2l-2',
    name: 'QiYi 2: Basic Insert (Left Slot / Front)',
    group: 'Easy Inserts (Cases 1-4)',
    qiyiId: '2',
    recommendedAlg: "U (R U' R')",
    alg: "U R U' R'",
    qiyiAlg: "(U R U' R')",
    intuition: "Pair is formed on top. Align over slot and insert directly with U (R U' R').",
    setup: "R U R' U'",
    triggers: [{ name: 'Direct Pair', code: "U R U' R'" }]
  },
  {
    id: 'f2l-3',
    name: 'QiYi 3: Direct 3-Move Gold Insert',
    group: 'Easy Inserts (Cases 1-4)',
    qiyiId: '3',
    recommendedAlg: "R U R'",
    alg: "R U R'",
    qiyiAlg: "(R U R')",
    intuition: "Corner and edge are already paired and aligned. 3 lightning-fast moves: Right Up, Top Left, Right Down!",
    setup: "R U' R'",
    triggers: [{ name: '3-Move Gold', code: "R U R'" }]
  },
  {
    id: 'f2l-4',
    name: 'QiYi 4: Direct Left / Mirror 3-Move Insert',
    group: 'Easy Inserts (Cases 1-4)',
    qiyiId: '4',
    recommendedAlg: "F' U' F",
    alg: "F' U' F",
    qiyiAlg: "y' (R' U' R)",
    intuition: "Mirror of Case 3. Insert into front slot with F' U' F or rotate y' and do R' U' R.",
    setup: "F' U F",
    triggers: [{ name: 'Front Insert', code: "F' U' F" }]
  },
  {
    id: 'f2l-5',
    name: 'QiYi 5: Split Pair, Different Colors on Top',
    group: 'Different Colors on Top (Cases 5-8)',
    qiyiId: '5',
    recommendedAlg: "U' (R U' R') U2 (R U' R')",
    alg: "U' R U' R' U2 R U' R'",
    qiyiAlg: "U' (R U R') (R U R')",
    intuition: "Separate corner and edge: hide corner in bottom layer, move edge to opposite side, unhide, then 3-move insert.",
    setup: "R U R' U2 R U R' U"
  },
  {
    id: 'f2l-6',
    name: 'QiYi 6: Split Pair, Different Colors (Mirror)',
    group: 'Different Colors on Top (Cases 5-8)',
    qiyiId: '6',
    recommendedAlg: "d (R' U R) d2 (R' U R)",
    alg: "y' U R' U R U2 R' U R",
    qiyiAlg: "y' U (R' U' R) (R' U' R)",
    intuition: "Left-handed mirror of Case 5. Separate and pair into the left slot.",
    setup: "R' U' R d2 R' U' R d'"
  },
  {
    id: 'f2l-7',
    name: 'QiYi 7: Corner & Edge Touching, Different Top Colors',
    group: 'Different Colors on Top (Cases 5-8)',
    qiyiId: '7',
    recommendedAlg: "U' (R U R') U2 (R U' R')",
    alg: "U' R U R' U2 R U' R'",
    qiyiAlg: "y' (U R' U' R) (U'2 R' U R)",
    intuition: "Pieces are touching with different top colors. Split them apart with R U R', orient, then insert.",
    setup: "R U R' U2 R U' R' U"
  },
  {
    id: 'f2l-8',
    name: 'QiYi 8: Corner & Edge Separated, Different Top Colors',
    group: 'Different Colors on Top (Cases 5-8)',
    qiyiId: '8',
    recommendedAlg: "U' (R U R' U') (R U2 R')",
    alg: "U' R U R' U' R U2 R'",
    qiyiAlg: "U' (R U R' U') (R U'2 R')",
    intuition: "Pair them up using sexy move variant, then insert with R U2 R'.",
    setup: "R U2 R' U R U' R' U"
  },
  {
    id: 'f2l-9',
    name: 'QiYi 9: Same Colors on Top (Corner facing Front)',
    group: 'Same Color on Top (Cases 9-12)',
    qiyiId: '9',
    recommendedAlg: "U' (R U2 R') U2 (R U' R')",
    alg: "U' R U2 R' U2 R U' R'",
    qiyiAlg: "y' (U R' U2) (R U'2 R' U R)",
    intuition: "Both pieces have the same color on top. Hide corner with R, move edge with U2, restore corner to form pair, then insert!",
    setup: "R U R' U2 R U2 R' U"
  },
  {
    id: 'f2l-10',
    name: 'QiYi 10: Same Colors on Top (Corner facing Right)',
    group: 'Same Color on Top (Cases 9-12)',
    qiyiId: '10',
    recommendedAlg: "U (R U2 R') U2 (R U R')",
    alg: "U R U2 R' U2 R U R'",
    qiyiAlg: "U' (R U'2) (R' U2) (R U' R')",
    intuition: "Right-handed variation of Case 9. Forms connected pair with U2 and drops directly into slot.",
    setup: "R U' R' U2 R U2 R' U'"
  },
  {
    id: 'f2l-11',
    name: 'QiYi 11: Same Colors on Top, Attached Incorrectly',
    group: 'Same Color on Top (Cases 9-12)',
    qiyiId: '11',
    recommendedAlg: "U (R U2 R') (R U R')",
    alg: "U R U2 R2 U R'",
    qiyiAlg: "y' (U R' U2) (R U' R' U R)",
    intuition: "Pieces are stuck together incorrectly on top. Break apart with R U2 R', then pair into slot.",
    setup: "R U' R' R U2 R' U'"
  },
  {
    id: 'f2l-12',
    name: 'QiYi 12: Same Colors on Top, Mirror Attached',
    group: 'Same Color on Top (Cases 9-12)',
    qiyiId: '12',
    recommendedAlg: "U' (R U2 R') (R U' R')",
    alg: "U' R U2 R2 U' R'",
    qiyiAlg: "U (R U'2) (R' U R U' R')",
    intuition: "Separate and immediately pair into back slot without cube rotations.",
    setup: "R U R' R U2 R' U"
  },
  {
    id: 'f2l-13',
    name: 'QiYi 13: White Facing UP, Edge in Top Layer',
    group: 'White Facing UP (Cases 13-16)',
    qiyiId: '13',
    recommendedAlg: "(R U' R' U2) (R U R')",
    alg: "R U' R' U2 R U R'",
    qiyiAlg: "(R U' R' U2) (R U R')",
    intuition: "Match edge with side center, turn face away from slot, place corner on top of it, insert pair!",
    setup: "R U' R' U2 R U R'"
  },
  {
    id: 'f2l-14',
    name: 'QiYi 14: White Facing UP, Mirror (Left Slot)',
    group: 'White Facing UP (Cases 13-16)',
    qiyiId: '14',
    recommendedAlg: "y' (R' U R U2) (R' U' R)",
    alg: "F' U F U2 F' U' F",
    qiyiAlg: "y' (R' U R U'2) (R' U' R)",
    intuition: "Mirror of Case 13. Match edge color, hide slot, pair corner on top, insert.",
    setup: "F' U F U2 F' U' F"
  },
  {
    id: 'f2l-15',
    name: 'QiYi 15: White Facing UP, Edge Needs Flip Setup',
    group: 'White Facing UP (Cases 13-16)',
    qiyiId: '15',
    recommendedAlg: "U' (R U2 R' U) (R U R')",
    alg: "U' R U2 R' U R U R'",
    qiyiAlg: "U' (R U'2 R' U) (R U R')",
    intuition: "Corner white faces UP. Move corner away with R U2 R', orient edge, pair and insert.",
    setup: "R U' R' U' R U2 R' U"
  },
  {
    id: 'f2l-16',
    name: 'QiYi 16: White Facing UP, Mirror Flip Setup',
    group: 'White Facing UP (Cases 13-16)',
    qiyiId: '16',
    recommendedAlg: "y' U (R' U2 R U') (R' U' R)",
    alg: "U F' U2 F U' F' U' F",
    qiyiAlg: "y' U (R' U'2 R' U) U2(R' U' R')",
    intuition: "Left-handed mirror of Case 15.",
    setup: "F' U F U F' U2 F U'"
  },
  {
    id: 'f2l-17',
    name: 'QiYi 17: Split Pair, White Facing Front',
    group: 'Corner & Edge Split (Cases 17-18)',
    qiyiId: '17',
    recommendedAlg: "(R U' R' U) (R U' R' U2) (R U' R')",
    alg: "R U' R' U R U' R' U2 R U' R'",
    qiyiAlg: "y' U (R' U R U') y (R U R')",
    intuition: "Corner has white facing front. Separate pieces, match edge, pair up and insert.",
    setup: "R U R' U2 R U R' U' R U R'"
  },
  {
    id: 'f2l-18',
    name: 'QiYi 18: Split Pair, White Facing Right',
    group: 'Corner & Edge Split (Cases 17-18)',
    qiyiId: '18',
    recommendedAlg: "(R U R' U') (R U R' U2) (R U R')",
    alg: "R U R' U' R U R' U2 R U R'",
    qiyiAlg: "U' (R U R' U') y' (R' U' R)",
    intuition: "Corner has white facing right. Sexy move brings pieces into alignment, then insert.",
    setup: "R U' R' U2 R U' R' U R U' R'"
  },
  {
    id: 'f2l-19',
    name: 'QiYi 19: Corner in Bottom Slot (Triple Sexy)',
    group: 'Piece in Bottom Slot (Cases 19-22)',
    qiyiId: '19',
    recommendedAlg: "(R U R' U')3",
    alg: "R U R' U' R U R' U' R U R' U'",
    qiyiAlg: "(U R U' R')3",
    intuition: "Corner is stuck in slot oriented incorrectly. Triple (R U R' U') solves it instantly with pure muscle memory!",
    setup: "R U R' U' R U R' U' R U R' U'",
    triggers: [{ name: 'Triple Sexy Move', code: "(R U R' U')3" }]
  },
  {
    id: 'f2l-20',
    name: 'QiYi 20: Sledgehammer Eject & Insert',
    group: 'Piece in Bottom Slot (Cases 19-22)',
    qiyiId: '20',
    recommendedAlg: "U' (R' F R F') (R U' R')",
    alg: "U' R' F R F' R U' R'",
    qiyiAlg: "U' (R' F R F') (R U' R')",
    intuition: "Use Sledgehammer (R' F R F') to eject the trapped edge and simultaneously pair with corner!",
    setup: "R U R' F R' F' R U",
    triggers: [{ name: 'Sledgehammer Eject', code: "R' F R F'" }]
  },
  {
    id: 'f2l-21',
    name: 'QiYi 21: Corner in Bottom Slot, White Facing Front',
    group: 'Piece in Bottom Slot (Cases 19-22)',
    qiyiId: '21',
    recommendedAlg: "(R U' R' U) (R U' R')",
    alg: "R U' R' U R U' R'",
    qiyiAlg: "U' (R U'2 R' U) y' (R' U' R)",
    intuition: "Corner in slot with white facing front. Eject with R U' R' and insert in one motion.",
    setup: "R U R' U' R U R'"
  },
  {
    id: 'f2l-22',
    name: 'QiYi 22: Corner in Bottom Slot, White Facing Right',
    group: 'Piece in Bottom Slot (Cases 19-22)',
    qiyiId: '22',
    recommendedAlg: "(R U2 R' U) (R U' R')",
    alg: "R U2 R' U R U' R'",
    qiyiAlg: "y' U (R' U R U') (R' U' R)",
    intuition: "Corner in slot with white facing right. Eject with R U2 R' and pair with edge.",
    setup: "R U R' U' R U2 R'"
  },
  {
    id: 'f2l-23',
    name: 'QiYi 23: White Facing UP, Both Stuck in Front',
    group: 'White Facing UP Advanced (Cases 23-26)',
    qiyiId: '23',
    recommendedAlg: "R U' R' U R U2 R' U R U' R'",
    alg: "R U' R' U R U2 R' U R U' R'",
    qiyiAlg: "R U' R' U R U'2 R' U R U' R'",
    intuition: "Corner white facing up, edge in top layer. Cycle with R U' R' U to align, then insert.",
    setup: "R U R' U' R U2 R' U' R U R'"
  },
  {
    id: 'f2l-24',
    name: 'QiYi 24: White Facing UP, Quick Align',
    group: 'White Facing UP Advanced (Cases 23-26)',
    qiyiId: '24',
    recommendedAlg: "U' (R U' R' U) (R U R')",
    alg: "U' R U' R' U R U R'",
    qiyiAlg: "U' (R U' R' U) (R U R')",
    intuition: "Move edge over center, align corner to match, then standard 3-move insert.",
    setup: "R U' R' U' R U R' U"
  },
  {
    id: 'f2l-25',
    name: 'QiYi 25: White Facing UP, Double Setup',
    group: 'White Facing UP Advanced (Cases 23-26)',
    qiyiId: '25',
    recommendedAlg: "R U' R' U2 R U' R' U R U' R'",
    alg: "R U' R' U2 R U' R' U R U' R'",
    qiyiAlg: "R U' R' U2 R U' R' U R U' R'",
    intuition: "Hide corner, separate edge, re-pair and insert.",
    setup: "R U R' U' R U R' U2 R U R'"
  },
  {
    id: 'f2l-26',
    name: 'QiYi 26: White Facing UP, Left Slot Setup',
    group: 'White Facing UP Advanced (Cases 23-26)',
    qiyiId: '26',
    recommendedAlg: "(R U' R' U2) y' (R' U' R)",
    alg: "R U' R' U2 F' U' F",
    qiyiAlg: "(R U' R' U2) y' (R' U' R)",
    intuition: "Forms pair and inserts into left/front slot.",
    setup: "F' U F U2 R U R'"
  },
  {
    id: 'f2l-27',
    name: 'QiYi 27: Corner in Bottom, Edge in Top (Right)',
    group: 'Corner Stuck in Slot (Cases 27-30)',
    qiyiId: '27',
    recommendedAlg: "(R U' R' U) (R U2) (R U' R')",
    alg: "R U' R' U R U2 R U' R'",
    qiyiAlg: "(R U' R' U) (R U2) (R U' R')",
    intuition: "Corner in bottom slot, edge in top layer. Eject corner and form pair in one fluid motion.",
    setup: "R U R' U2 R' U' R U R'"
  },
  {
    id: 'f2l-28',
    name: 'QiYi 28: Corner in Bottom, Edge in Top (Front)',
    group: 'Corner Stuck in Slot (Cases 27-30)',
    qiyiId: '28',
    recommendedAlg: "(R U R' U') (R U2 R' U') (R U R')",
    alg: "R U R' U' R U2 R' U' R U R'",
    qiyiAlg: "(R U R' U') (R U2 R' U') (R U R')",
    intuition: "Sexy move eject followed by U2 pair formation.",
    setup: "R U' R' U R U2 R' U R U' R'"
  },
  {
    id: 'f2l-29',
    name: 'QiYi 29: Corner in Bottom, Edge Oriented in Top',
    group: 'Corner Stuck in Slot (Cases 27-30)',
    qiyiId: '29',
    recommendedAlg: "(R U) F (R U R' U') F' R'",
    alg: "R U F R U R' U' F' R'",
    qiyiAlg: "(R U) F (R U R' U') F' R'",
    intuition: "Uses F-turn trigger to eject and solve simultaneously.",
    setup: "R F U R U' R' F' U' R'"
  },
  {
    id: 'f2l-30',
    name: 'QiYi 30: Corner in Bottom, Edge in Back',
    group: 'Corner Stuck in Slot (Cases 27-30)',
    qiyiId: '30',
    recommendedAlg: "(R U' R') (U' R U' R' U) y' (R' U' R)",
    alg: "R U' R2 U' R' U F' U' F",
    qiyiAlg: "(R U' R') (U' R U' R' U) y' (R' U' R)",
    intuition: "Solves edge from back into slot without whole cube rotation.",
    setup: "R' U R y U' R U R' U R U R'"
  },
  {
    id: 'f2l-31',
    name: 'QiYi 31: Edge in Middle Slot, Corner on Top',
    group: 'Edge Stuck in Slot (Cases 31-36)',
    qiyiId: '31',
    recommendedAlg: "(R U' R' U) y' (R' U2 R U2) (R' U' R)",
    alg: "R U' R' U F' U2 F U2 F' U' F",
    qiyiAlg: "(R U' R' U) y' (R' U2 R U'2) (R' U' R)",
    intuition: "Edge is in middle slot. Eject edge with R U' R', pair with corner and insert.",
    setup: "F' U F U2 F' U2 F U' R U R'"
  },
  {
    id: 'f2l-32',
    name: 'QiYi 32: Edge in Middle Slot, White Facing Right',
    group: 'Edge Stuck in Slot (Cases 31-36)',
    qiyiId: '32',
    recommendedAlg: "(U R U' R' U') y' (R' U R)",
    alg: "U R U' R' U' F' U F",
    qiyiAlg: "(U R U' R' U') y' (R' U R)",
    intuition: "Eject edge while orienting corner, then insert with F' U F.",
    setup: "F' U' F U R U R' U'"
  },
  {
    id: 'f2l-33',
    name: 'QiYi 33: Edge in Middle Slot, Sledgehammer Setup',
    group: 'Edge Stuck in Slot (Cases 31-36)',
    qiyiId: '33',
    recommendedAlg: "(R' F R U) (R U' R' F')",
    alg: "R' F R U R U' R' F'",
    qiyiAlg: "(R' F R U) (R U' R' F')",
    intuition: "Beautiful Sledgehammer variant: ejects edge and inserts pair in 8 smooth moves.",
    setup: "F R U R' U' R' F' R"
  },
  {
    id: 'f2l-34',
    name: 'QiYi 34: Edge in Middle Slot, Left Insertion',
    group: 'Edge Stuck in Slot (Cases 31-36)',
    qiyiId: '34',
    recommendedAlg: "y' (R' U2) (R U R' U' R)",
    alg: "F' U2 F U F' U' F",
    qiyiAlg: "y' (R' U2) (R U R' U' R)",
    intuition: "Eject and insert into left slot.",
    setup: "F' U F U' F' U2 F"
  },
  {
    id: 'f2l-35',
    name: 'QiYi 35: Edge in Middle Slot, White Facing UP',
    group: 'Edge Stuck in Slot (Cases 31-36)',
    qiyiId: '35',
    recommendedAlg: "R U R' U2 (R U' R' U) (R U R')",
    alg: "R U R' U2 R U' R' U R U R'",
    qiyiAlg: "R U R' U2 (R U' R' U) (R U R')",
    intuition: "Corner white facing up, edge in slot. Eject edge with R U R', pair up and insert.",
    setup: "R U' R' U' R U R' U2 R U' R'"
  },
  {
    id: 'f2l-36',
    name: 'QiYi 36: Edge in Middle Slot, Double Turn',
    group: 'Edge Stuck in Slot (Cases 31-36)',
    qiyiId: '36',
    recommendedAlg: "(R U2 R') (U' R U R')",
    alg: "R U2 R' U' R U R'",
    qiyiAlg: "(R U2 R') (U' R U R')",
    intuition: "Eject with R U2 R', pair on top and insert with R U R'.",
    setup: "R U' R' U R U2 R'"
  },
  {
    id: 'f2l-37',
    name: 'QiYi 37: Both in Slot, Flipped Corner & Edge',
    group: 'Both Pieces in Slot (Cases 37-41)',
    qiyiId: '37',
    recommendedAlg: "F U (R U' R' F') (R U' R')",
    alg: "F U R U' R' F' R U' R'",
    qiyiAlg: "F U (R U' R' F') (R U' R')",
    intuition: "Both pieces are in the slot but both are flipped/twisted. Eject with F-trigger and solve directly.",
    setup: "R U R' F R U R' U' F'"
  },
  {
    id: 'f2l-38',
    name: 'QiYi 38: Both in Slot, Left Eject',
    group: 'Both Pieces in Slot (Cases 37-41)',
    qiyiId: '38',
    recommendedAlg: "y' (R' U) (R U' R' U R)",
    alg: "F' U F U' F' U F",
    qiyiAlg: "y' (R' U) (R U' R' U R)",
    intuition: "Eject both into top layer and insert into target slot.",
    setup: "F' U' F U F' U' F"
  },
  {
    id: 'f2l-39',
    name: 'QiYi 39: Both in Slot, Double Sexy Eject',
    group: 'Both Pieces in Slot (Cases 37-41)',
    qiyiId: '39',
    recommendedAlg: "(R U R' U') (R U R')",
    alg: "R U R' U' R U R'",
    qiyiAlg: "(R U R' U') (R U R')",
    intuition: "Corner and edge stuck together in slot. Eject with Sexy Move (R U R' U') and insert directly with R U R'!",
    setup: "R U' R' U R U' R'"
  },
  {
    id: 'f2l-40',
    name: 'QiYi 40: Both in Slot, Flipped Edge in Slot',
    group: 'Both Pieces in Slot (Cases 37-41)',
    qiyiId: '40',
    recommendedAlg: "(R U' R' U) (R U' R')",
    alg: "R U' R' U R U' R'",
    qiyiAlg: "(R U' R' U) (R U' R')",
    intuition: "Corner is solved, edge is flipped in slot. Eject with R U' R' U and insert.",
    setup: "R U R' U' R U R'"
  },
  {
    id: 'f2l-41',
    name: 'QiYi 41: Both in Slot, Mirror Flipped Edge',
    group: 'Both Pieces in Slot (Cases 37-41)',
    qiyiId: '41',
    recommendedAlg: "y' (R' U R U) (R' U' R)",
    alg: "F' U F U F' U' F",
    qiyiAlg: "y' (R' U R U) (R' U' R)",
    intuition: "Mirror of Case 40. Eject and pair into slot.",
    setup: "F' U F U' F' U' F"
  }
];

export const SPEEDCUBER_GUIDE = [
  {
    section: 'Hardware: Upgrade to a Magnetic Speedcube',
    priority: 'HIGH PRIORITY (Day 1)',
    content: `You mentioned you are currently using a standard non-magnetic cube and planning to buy a GAN or others once you learn.
**Critical insight**: A standard non-magnetic cube is actively hindering your learning!
- On a non-magnetic cube, layers overshoot, misalign, and cause painful lockups. This forces your wrists and fingers to exert 3x more force, causing muscle fatigue.
- Magnetic cubes have miniature neodymium magnets inside the edge and corner pieces that automatically "snap" every turn into crisp 90° alignment. Fingertricks (flicks) work effortlessly.
- **Top Recommendations**:
  1. **MoYu RS3M V5 (Dual-Adjustment or Ball-Core)** (~$9-$15): The undisputed world champion for price-to-performance. Highly recommended!
  2. **GAN 356 M / GAN 12 MagLev** (~$25-$60): Ultra-lightweight (under 65g), premium feel, effortless turning.
  3. **X-Man Tornado V3 Flagship** (~$25): Exceptionally quiet, buttery smooth, customizable magnets.`
  },
  {
    section: 'Ergonomics & Finger Health',
    priority: 'DAILY HABIT',
    content: `Speedcubing is a fine-motor skill. Practice smart to avoid finger and wrist fatigue:
- **No Whole-Cube Regrips**: Never rotate the entire cube in your hands if you can turn U with an index finger flick.
- **Index Finger Flick (U)**: Push the back-right corner with your right index finger forward.
- **Double Flick (U2)**: Right index flick, followed immediately by right middle finger flick in one fluid wave.
- **Ring Finger (D and M)**: Use your ring finger from underneath to pull the bottom layer D or slice M.
- **Warm Up**: Do 2 minutes of gentle wrist rotations and finger extensions before speed sessions.`
  },
  {
    section: 'The 4-Stage Roadmap to Sub-20 & Sub-10',
    priority: 'PROGRESSION TIMELINE',
    content: `
1. **Stage 1: Complete the Cube Every Time (Target: Sub-60s)**:
   - White cross on bottom (planned in inspection).
   - Intuitive F2L (slow, deliberate, no pauses).
   - 2-Look OLL (9 algs) + 2-Look PLL (6 algs).
2. **Stage 2: Fluid F2L & Fingertricks (Target: Sub-30s)**:
   - Master basic inserts into back slots without cube rotations (y / y').
   - U2 double flicks and sexy move (R U R' U') muscle memory.
3. **Stage 3: Full PLL & Inspection (Target: Sub-20s)**:
   - Learn all 21 PLL algorithms (1 new alg per 2 days).
   - Cross in <= 8 moves planned 100% blind during 15s inspection.
   - Sub-20 = 55 moves at 2.8 TPS (Turns Per Second). Very calm, fluid turning!
4. **Stage 4: Full OLL & Lookahead (Target: Sub-10s)**:
   - Full 57 OLL.
   - Lookahead: While inserting current F2L pair, eyes track the next corner/edge. Zero pauses between slots.
   - Cross + 1 (planning cross AND first F2L pair during inspection).`
  }
];
