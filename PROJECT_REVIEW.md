# CubePro project review

Reviewed 13 October 2026. Scope: project structure, cube animation/state consistency, playback interactions, and UX/UI priorities. Application source was not changed.

## Assessment

CubePro is a static, browser-based learning app built with HTML, CSS, ES modules, bundled Three.js/OrbitControls, localStorage, and a service worker. Its core features are guided solving, an algorithm library, 3D playback, recognition drills, a timer, and a learning roadmap.

The data includes 16 beginner last-layer cases, 21 PLL cases, 45 F2L cases, and 16 white-cross cases. The separation between the cube engine, visualizer, timer, trainer, and algorithm data is useful. This UX work can stay in the existing architecture; a framework migration would not address the observed problems.

The main maintenance constraints are duplicated case/move descriptions across app.js, index.html, and algorithms-data.js; a stylesheet exceeding 4,000 lines with layered responsive/theme overrides; and no checked-in automated test setup or project README.

## Confirmed animation mismatch

The observation that colors change when an animation finishes has a concrete explanation:

1. `CubeVisualizer.rotateLayer3D()` animates meshes using its own axis, angle, and layer selection.
2. At completion, it calls `Cube.applyMove()` to update a separate facelet model.
3. `_sync3DFromCubeState()` discards the animated meshes and rebuilds their colors from that model.

If the two implementations disagree, the rebuild visibly changes sticker positions. The final image is authoritative for the app, but is not necessarily the physically correct result.

### Verification

A Node check loaded the project's actual Three.js and visualizer code. It assigned a unique identity to all 54 stickers, advanced the real animation callback to immediately before completion, rounded the nearly completed world transforms to cube coordinates, and compared them with the rebuilt result. Unique identities expose problems that solid-color faces can hide.

Of 66 tested move spellings (including aliases, inverse turns, and double turns), 40 matched and 26 differed:

| Move family | Result |
| --- | --- |
| U, D, R, L, F, B, M | All tested variants matched |
| r/Rw, l/Lw | All tested variants matched |
| x, y | All tested variants matched |
| f/Fw, u/Uw, d/Dw | All tested variants differed |
| b/Bw | Visualizer animates these, but the engine does not implement them |
| z | Quarter turns differed; z2 matched |

The engine's z composition produces the opposite quarter rotation from the visualizer. Its f/u/d compositions also disagree with the selected physical layers. The beginner L-shape and dot cases use f, so this affects ordinary learning flows, not just obscure inputs.

Relevant code: `js/cube-engine.js:258`, `js/cube-engine.js:320`, `js/cube-visualizer.js:373`, `js/cube-visualizer.js:496`.

Ordinary move/inverse checks passed for the 15 implemented move bases tested. Those checks alone cannot catch the animation mismatch: two mutually inverse but incorrect definitions can still return to their starting state.

## Other findings affecting trust and usability

| Priority | Finding and user impact | Evidence |
| --- | --- | --- |
| High | Reset or loading another case does not cancel the active animation. An old callback can apply its move to the newly reset/loaded cube. | Reproduced: start R, reset, finish the pending frame; step becomes 1 and the cube differs from its initial state. `cube-visualizer.js:202`, `:223`, `:496`. |
| High | Play at the end resets the cube but does not restart playback. | Reproduced: `play()` sets isPlaying, then reset calls pause; no animation is scheduled. `cube-visualizer.js:279`. |
| High | The six-repeat drill is not actually parsed as six repeats. | `(R U R' U')6` parses into four moves plus an invalid `6`; unrecognized tokens can also animate through the visualizer's default whole-cube turn. `app.js:675`, `cube-engine.js:361`. |
| Medium | Move demonstrations alter the same cube as case playback without updating the case sequence/step. | `visualizeSingleMove()` mutates cube state while leaving the loaded case intact. `cube-visualizer.js:342`, `app.js:531`. |
| Medium | The top-down recognition view has its right rim reversed relative to the 3D mapping. | Its vertical rim reads R[0], R[1], R[2]; back-to-front corresponds to R[2], R[1], R[0]. `cube-visualizer.js:609`. |
| Medium | The 2D view remains at the previous completed state during a 3D turn. | render2D runs on completion. This may also explain a perceived temporary disagreement when comparing the two previews. |
| Medium | Playback labels and selections do not consistently reflect actual state. | Play text is managed separately by click handlers; completion/keyboard actions do not share that update path. On initial load T-Perm is displayed while Daisy Drop is highlighted in the sidebar. |
| Medium | Keyboard access is incomplete. | Clickable move pills are spans; the cheat-sheet modal lacks dialog semantics, focus management, and a focus trap. Window-level shortcuts can fire while the modal is open. |
| Lower | Rendering work continues while the visualizer is hidden, and geometry is recreated without disposal on every sync. | Continuous requestAnimationFrame loop and new BoxGeometry calls in `cube-visualizer.js:130`, `:540`. Reuse geometry and stop unnecessary hidden rendering; measure impact before broader optimization. |

## Recommended UX/UI sequence

### 1. Make playback dependable

Correct and cross-check the move definitions, cancel obsolete animations and delayed demonstration steps, fix replay, reject unsupported notation, and separate case playback from the notation sandbox. Keep the Play/Pause label, highlighted move, and step count driven by the same playback state. Explicitly define Pause as finishing the current turn and stopping before the next, if that remains the intended behavior.

Acceptance: every supported move ends with no sticker relocation on resync; reset and case changes survive old callbacks; replay works after completion; the six-repeat drill performs 24 moves.

### 2. Put the cube and controls first

In the inspected desktop viewport, the header, large helper banner, repeated case title, and full English translation push the cube and controls below the initial screen. Use one compact case heading, a short hold instruction, the cube, the current move, and playback controls as the primary view. Put the complete translation and notation explorer behind expandable help. Preserve useful learning explanations without showing all of them simultaneously.

Add a clear step indicator such as “Move 4 of 14,” a restore-view button after orbiting the camera, and an explicit distinction between rotating the camera and executing a whole-cube move. Keep orientation labels accurate after cube rotations.

### 3. Clarify the learning journey

The Solve screen combines immediate case recognition with a long-term roadmap. Prioritize the current solving stage and matching cases, then reveal later stages and the roadmap separately. Make the selected case match the one shown in the player. Use the existing algorithm dataset for case names, instructions, and sequences to reduce contradictory copies.

### 4. Refine visual and accessible behavior

Reduce competing badges, glows, and duplicated icon/emoji labels. Use consistent primary/secondary controls and spacing. Make move pills real buttons, manage modal focus, communicate active navigation state, and respect reduced-motion preferences. Validate the cube/control layout on a phone before shipping; source-level responsive rules alone do not establish usability.

## Limits

Reviewed the live desktop Solve and Visualizer screens and ran source-level animation and playback checks. Did not complete a phone/device matrix, GPU performance benchmark, full timer audit, or correctness audit of every teaching case. No fixes or redesign were implemented in this analysis.
