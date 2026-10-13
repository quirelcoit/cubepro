import { BEGINNER_LAST_LAYER, PLL_ALGORITHMS, F2L_CASES, WHITE_CROSS_CASES } from './algorithms-data.js';

export const LEVELS = ['beginner', 'intermediate', 'pro'];
export const STAGES = {
  cross: { name: 'Cross', subtitle: 'Build your foundation', goal: 'Solve four white edges on the bottom, each matching its side center.', levels: {
    beginner: { title: 'From daisy to cross', steps: ['Find the four edges with a white sticker; corners come later.', 'Bring white edges around the yellow center. Move a filled petal out of the way before adding another.', 'Match each edge’s side color to its center, then turn that face twice to send white to the bottom.'], drill: 'Build the daisy and drop all four edges on five different scrambles. Check the side centers each time.', ready: 'You can build an aligned white cross without a move-by-move guide.' },
    intermediate: { title: 'Solve directly on the bottom', steps: ['Keep white on the bottom and locate all four cross edges.', 'Insert edges directly instead of making a daisy. Use the bottom layer to protect edges already solved.', 'Think about two edges together; finish by aligning the bottom with the side centers.'], drill: 'Plan two cross edges before turning. Complete ten crosses slowly and count your moves.', ready: 'You can preserve solved edges and explain where your next edge will go.' },
    pro: { title: 'Plan the cross, track the next pair', steps: ['Use inspection to predict all four edge positions through your solution.', 'Execute your plan without watching the cross. Check the result afterward.', 'Track a first F2L pair during a familiar cross solution. Cross + 1 means planning the next pair; an X-cross solves a pair with the cross.'], drill: 'Plan a cross, close your eyes, execute, then check. Add first-pair tracking only when the cross is reliable.', ready: 'Your planned cross is repeatable and you can find the first F2L pair without a long pause.' }
  } },
  f2l: { name: 'F2L', subtitle: 'Pair and insert', goal: 'Pair each white corner with its matching edge, then solve them together while preserving the cross.', levels: {
    beginner: { title: 'Understand your first pair', steps: ['Find a white corner and the edge with its two non-white colors.', 'Bring both pieces to the top without breaking your cross. Use an empty slot to separate or pair them.', 'Align the connected pair above its matching slot and insert. Repeat for all four slots.'], drill: 'Use the four easy-insert examples below. Pause to identify the corner, edge and target slot before each move.', ready: 'You can explain how a pair is formed and insert it while keeping the cross solved.' },
    intermediate: { title: 'Recognize and solve common cases', steps: ['Compare the colors on top to choose how to pair the pieces.', 'Learn why each setup works, then recall the case without reading the formula.', 'Practice left and right slots. Preserve other solved pairs and reduce unnecessary cube rotations.'], drill: 'Solve all four pairs slowly on five scrambles. Record where you paused or broke a pair, then review those cases.', ready: 'You solve common pairs independently and can recover a piece trapped in a slot.' },
    pro: { title: 'Efficient cases and continuous lookahead', steps: ['Review the full 41-case set, concentrating on cases that cause a pause.', 'Use back-slot inserts when useful; choose efficient solutions without forcing a fixed slot order.', 'Once executing a familiar pair, look for the next one. Add edge-control choices only after basic pairing is automatic.'], drill: 'Use the metronome at a comfortable pace. Keep turning smoothly and reduce pauses before increasing speed.', ready: 'Your recognition and execution overlap, with few regrips and deliberate slot choices.' }
  } },
  oll: { name: 'OLL', subtitle: 'Orient the last layer', goal: 'Make the whole top yellow while keeping the first two layers solved. Side colors do not need to match yet.', levels: {
    beginner: { title: '2-look OLL: edges, then corners', steps: ['With F2L finished, recognize the yellow-edge pattern: dot, L, line or cross.', 'Orient the edges to make a yellow cross. Then recognize one of the seven corner patterns.', 'Orient the corners. Check that the first two layers are still solved before continuing to PLL.'], drill: 'Practice the three edge patterns and seven corner patterns separately. Match the exact setup and hold angle in the preview.', ready: 'You can make a yellow face from any last-layer orientation using the two steps.' },
    intermediate: { title: 'Connect both looks', steps: ['Recognize corner patterns from the top and the yellow stickers on the sides.', 'Choose your grip before turning and rehearse an algorithm consistently.', 'After the edge step, inspect the corners immediately instead of searching the whole cube again.'], drill: 'Use the seven corner cases below. Name the pattern and your first move before revealing or playing the sequence.', ready: 'You recognize every 2-look corner case and execute it without reading.' },
    pro: { title: 'Build toward full OLL', steps: ['Keep 2-look OLL as a reliable fallback while learning new cases.', 'Use the linked full-OLL reference to learn a small shape family at a time; full OLL contains 57 cases.', 'Alternate recognition, slow execution and full solves. Add a new family only after the previous one is reliable.'], drill: 'Study a small family in the full-OLL reference, then practice recognition on a real cube. The local examples below are the ten 2-look foundations.', ready: 'You recognize and execute the families you have studied without losing your 2-look fallback.', reference: ['Full OLL reference · J Perm', 'https://jperm.net/algs/oll'], coverage: 'Local playback includes the 10 two-look foundations. The full 57-case reference opens online; those additional cases are not yet in the offline library.' }
  } },
  pll: { name: 'PLL', subtitle: 'Finish the solve', goal: 'Move the oriented last-layer pieces into their correct positions, then align the top layer.', levels: {
    beginner: { title: '2-look PLL: corners, then edges', steps: ['Find matching corner pairs (headlights) and use the appropriate corner permutation.', 'With corners placed, identify the edge cycle or swap and hold the cube as shown.', 'Finish with a U, U′ or U2 adjustment if needed so every side matches its center.'], drill: 'Practice the two corner cases and four edge cases below. Check all four sides after every solve.', ready: 'You finish any oriented last layer with corner and edge steps plus final alignment.' },
    intermediate: { title: 'Learn all 21 PLL cases', steps: ['Learn cases in small groups, beginning with familiar edge cycles and adjacent swaps.', 'Recognize bars, headlights and blocks; check more than one side before deciding.', 'Practice recognition and execution separately, then connect them in full solves.'], drill: 'Mark a few cases Learning, rehearse their holds in 3D, then test your recall in Drills.', ready: 'You can recognize the 21 cases and finish in one permutation algorithm plus alignment.' },
    pro: { title: 'Recognize, execute, align', steps: ['Recognize familiar PLL cases from two visible sides.', 'Choose a comfortable grip and a consistent algorithm for each case.', 'Predict the final top-layer adjustment while executing. Track reliability as well as speed.'], drill: 'Mix all 21 cases in Drills. Repeat missed recognition patterns, then do full timed solves.', ready: 'Your PLL choice, execution and final alignment flow together reliably.' }
  } }
};

export const ALL_CASES = [...WHITE_CROSS_CASES, ...F2L_CASES, ...BEGINNER_LAST_LAYER.flatMap(g => g.cases), ...PLL_ALGORITHMS];

export function getLessonCases(stage, level) {
  if (!STAGES[stage] || !LEVELS.includes(level)) throw new Error('Unknown CFOP lesson');
  if (stage === 'cross') return WHITE_CROSS_CASES.filter(c => c.tier === level);
  if (stage === 'f2l') return F2L_CASES.filter(c => {
    const n = Number(c.id.replace('f2l-', ''));
    return Number.isFinite(n) && (level === 'beginner' ? n <= 4 : level === 'intermediate' ? n >= 5 && n <= 22 : true);
  });
  const lastLayer = BEGINNER_LAST_LAYER.flatMap(g => g.cases);
  if (stage === 'oll') return lastLayer.filter(c => level === 'intermediate' ? c.type === 'CO' : ['EO', 'CO'].includes(c.type));
  return level === 'beginner' ? lastLayer.filter(c => ['CP', 'EP'].includes(c.type)) : PLL_ALGORITHMS;
}

export function nextLesson(stage, level) {
  const stages = Object.keys(STAGES), index = stages.indexOf(stage);
  if (index < 3) return { stage: stages[index + 1], level };
  return { stage: 'cross', level: LEVELS[Math.min(2, LEVELS.indexOf(level) + 1)] };
}
