/**
 * App Orchestrator - Speedcube Pro
 * Coordinates navigation, algorithm vault with 2D diagrams, interactive visualizer,
 * flashcard trainer, metronome, timer, and roadmap persistence.
 */

import { BEGINNER_LAST_LAYER, PLL_ALGORITHMS, F2L_CASES, WHITE_CROSS_CASES } from './algorithms-data.js';
import { DiagramGenerator } from './diagram-generator.js';
import { CubeVisualizer } from './cube-visualizer.js';
import { SpeedTimer } from './timer.js';
import { AlgorithmTrainer } from './trainer.js';

/**
 * Translates Rubik's cube Singmaster moves into plain English for beginners.
 * e.g. "F (R U R' U') F'" -> "Front Clockwise • (Right Up, Top Left, Right Down, Top Right) • Front Counter-Clockwise"
 */
export function translateMoveToEnglish(algStr) {
  if (!algStr) return '';
  const map = {
    "R": "Right Up ⬆️",
    "R'": "Right Down ⬇️",
    "R2": "Right 180°",
    "L": "Left Down ⬇️",
    "L'": "Left Up ⬆️",
    "L2": "Left 180°",
    "U": "Top Left ⬅️",
    "U'": "Top Right ➡️",
    "U2": "Top 180°",
    "F": "Front Clockwise ↻",
    "F'": "Front Counter-Clockwise ↺",
    "F2": "Front 180°",
    "f": "Front 2-Layers ↻",
    "f'": "Front 2-Layers Back ↺",
    "f2": "Front 2-Layers 180°",
    "B": "Back Clockwise",
    "B'": "Back Counter-Clockwise",
    "B2": "Back 180°",
    "D": "Bottom Clockwise",
    "D'": "Bottom Counter-Clockwise",
    "D2": "Bottom 180°",
    "M": "Middle Down",
    "M'": "Middle Up",
    "M2": "Middle 180°"
  };

  const cleaned = algStr.replace(/[()]/g, ' ').replace(/\s+/g, ' ').trim();
  const tokens = cleaned.split(' ').filter(Boolean);
  const translated = tokens.map(t => {
    const base = t.replace(/\d+$/, '');
    if (map[t]) return map[t];
    if (map[base]) return map[base];
    return t;
  });
  return translated.join(' ➔ ');
}

class App {
  constructor() {
    this.currentCategory = 'beginner';
    this.currentCrossTier = 'all';
    this.searchQuery = '';
    this.masteryState = this.loadMasteryState();

    this.visualizer = null;
    this.timer = null;
    this.trainer = null;

    this.init();
  }

  init() {
    this.initNavigation();
    this.initVisualizer();
    this.initSolverWizard();
    this.initCheatSheetModal();
    this.initTrainer();
    this.initTimer();
    this.initRoadmapChecklist();
    this.initPWA();
    this.renderAlgorithms();
    this.renderVisualizerSidebar();
  }

  // --- Navigation & Tabs ---
  initNavigation() {
    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        this.switchTab(target);
      });
    });

    // Mobile Bottom Nav buttons (Thumb Zone)
    const mobileNavBtns = document.querySelectorAll('.mobile-nav-btn');
    mobileNavBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        this.switchTab(target);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    // Guard: Prevent window-level horizontal drift on all mobile devices
    window.addEventListener('scroll', () => {
      if (window.scrollX !== 0) {
        window.scrollTo({ left: 0, top: window.scrollY });
      }
    }, { passive: true });

    // Category pills in Algorithm Vault
    const catPills = document.querySelectorAll('.cat-pill');
    catPills.forEach(pill => {
      pill.addEventListener('click', () => {
        catPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.currentCategory = pill.dataset.cat;
        this.renderAlgorithms();
      });
    });

    // Cross Tier Pills (Beginner, Intermediate, Pro)
    const crossTierPills = document.querySelectorAll('.cross-tier-pill');
    crossTierPills.forEach(pill => {
      pill.addEventListener('click', () => {
        crossTierPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.currentCrossTier = pill.dataset.crossTier || 'all';
        this.renderAlgorithms();
      });
    });

    // Search input
    const searchInput = document.getElementById('alg-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderAlgorithms();
      });
    }

    // Glossary toggle
    const toggleGlossary = document.getElementById('btn-toggle-glossary');
    const glossaryContent = document.getElementById('glossary-content');
    if (toggleGlossary && glossaryContent) {
      toggleGlossary.addEventListener('click', () => {
        const isHidden = glossaryContent.style.display === 'none';
        glossaryContent.style.display = isHidden ? 'grid' : 'none';
        toggleGlossary.innerHTML = isHidden ? 'Quick Reference &#9662;' : 'Expand &#9656;';
      });
    }
  }

  switchTab(tabId, category = null) {
    document.querySelectorAll('.nav-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.tab === tabId);
    });

    document.querySelectorAll('.mobile-nav-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.tab === tabId);
    });

    document.querySelectorAll('.tab-pane').forEach(p => {
      p.classList.toggle('active', p.id === `tab-${tabId}`);
    });

    if (tabId === 'algorithms' && category) {
      this.currentCategory = category;
      document.querySelectorAll('.cat-pill').forEach(p => {
        p.classList.toggle('active', p.dataset.cat === category);
      });
      this.renderAlgorithms();
    }

    if (tabId === 'visualizer' && this.visualizer) {
      setTimeout(() => {
        this.visualizer.handleResize();
        this.visualizer.render();
      }, 60);
    }
    if (tabId === 'timer' && this.timer) {
      setTimeout(() => this.timer.renderProgressChart(), 50);
    }
  }

  filterCrossTier(tier) {
    this.switchTab('algorithms', 'cross');
    this.currentCrossTier = tier;
    document.querySelectorAll('.cross-tier-pill').forEach(p => {
      p.classList.toggle('active', p.dataset.crossTier === tier);
    });
    this.renderAlgorithms();
    const container = document.getElementById('alg-container');
    if (container) {
      container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // --- First-Glance Solver Wizard ---
  initSolverWizard() {
    // 1. Render mini SVG diagrams into matcher card thumbnails
    const thumbDot = document.getElementById('thumb-dot');
    if (thumbDot) {
      thumbDot.innerHTML = DiagramGenerator.renderOLLSVG({
        top: [0, 0, 0, 0, 1, 0, 0, 0, 0],
        rims: { B: [0, 1, 0], F: [0, 1, 0], L: [0, 1, 0], R: [0, 1, 0] }
      }, 95);
    }

    const thumbLshape = document.getElementById('thumb-lshape');
    if (thumbLshape) {
      thumbLshape.innerHTML = DiagramGenerator.renderOLLSVG({
        top: [0, 1, 0, 1, 1, 0, 0, 0, 0],
        rims: { B: [0, 0, 0], F: [0, 1, 0], L: [0, 0, 0], R: [0, 1, 0] }
      }, 95);
    }

    const thumbLine = document.getElementById('thumb-line');
    if (thumbLine) {
      thumbLine.innerHTML = DiagramGenerator.renderOLLSVG({
        top: [0, 0, 0, 1, 1, 1, 0, 0, 0],
        rims: { B: [0, 1, 0], F: [0, 1, 0], L: [0, 0, 0], R: [0, 0, 0] }
      }, 95);
    }

    const thumbSune = document.getElementById('thumb-sune');
    if (thumbSune) {
      thumbSune.innerHTML = DiagramGenerator.renderOLLSVG({
        top: [0, 1, 0, 1, 1, 1, 1, 1, 0],
        rims: { B: [1, 0, 0], F: [0, 0, 1], L: [0, 0, 0], R: [1, 0, 0] }
      }, 95);
    }

    const thumbHeadlights = document.getElementById('thumb-headlights');
    if (thumbHeadlights) {
      thumbHeadlights.innerHTML = DiagramGenerator.renderPLLSVG({
        pllArrows: [[0, 2, 2, 2], [2, 2, 0, 2]],
        rimColors: {
          L: ['#b71234', '#b71234', '#b71234'],
          R: ['#009b48', '#ff5800', '#0046ad'],
          F: ['#b71234', '#009b48', '#009b48'],
          B: ['#0046ad', '#0046ad', '#ff5800']
        }
      }, 95);
    }

    const thumbEdges = document.getElementById('thumb-edges');
    if (thumbEdges) {
      thumbEdges.innerHTML = DiagramGenerator.renderPLLSVG({
        pllArrows: [[2, 1, 1, 0], [1, 0, 1, 2], [1, 2, 2, 1]],
        rimColors: {
          B: ['#0046ad', '#0046ad', '#0046ad'],
          F: ['#009b48', '#ff5800', '#009b48'],
          L: ['#ff5800', '#b71234', '#ff5800'],
          R: ['#b71234', '#009b48', '#b71234']
        }
      }, 95);
    }

    // 2. Wire click handlers to all matcher cards
    const cards = document.querySelectorAll('.matcher-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const caseId = card.dataset.case;
        // Search in BEGINNER_LAST_LAYER
        let foundCase = null;
        for (const group of BEGINNER_LAST_LAYER) {
          const match = group.cases.find(c => c.id === caseId);
          if (match) {
            foundCase = match;
            break;
          }
        }

        if (foundCase) {
          this.switchTab('visualizer');
          this.loadCaseIntoVisualizer(
            foundCase.name,
            foundCase.recommendedAlg,
            foundCase.notes || '',
            foundCase.setup || '',
            foundCase.howToHold || 'Hold Yellow on TOP, White on BOTTOM.',
            foundCase.whatItDoes || '',
            foundCase.badgeTitle || 'BEGINNER LAST LAYER'
          );

          // Scroll to top of visualizer smoothly
          window.scrollTo({ top: 0, behavior: 'smooth' });

          // Auto-play after brief pause so the user immediately sees the move execute in 3D
          setTimeout(() => {
            if (this.visualizer) {
              this.visualizer.play();
              const playText = document.getElementById('vis-play-text');
              if (playText) playText.innerHTML = '&#10074;&#10074; Pause';
            }
          }, 350);
        }
      });
    });

    // 3. Wire step navigation buttons in wizard
    const step1Btn = document.getElementById('wizard-btn-step1');
    const step2Btn = document.getElementById('wizard-btn-step2');
    const step3Btn = document.getElementById('wizard-btn-step3');
    const step4Btn = document.getElementById('wizard-btn-step4');

    const updateActiveStep = (btn, filterType) => {
      document.querySelectorAll('.wizard-steps-bar .step-btn').forEach(b => {
        if (!b.classList.contains('done')) b.classList.remove('active');
      });
      btn.classList.add('active');

      // Highlight/filter corresponding cards
      cards.forEach(card => {
        const cId = card.dataset.case;
        let show = false;
        if (filterType === 'all') show = true;
        else if (filterType === 'eo' && (cId === 'b-eo-1' || cId === 'b-eo-2' || cId === 'b-eo-3')) show = true;
        else if (filterType === 'co' && cId === 'b-co-sune') show = true;
        else if (filterType === 'cp' && cId === 'b-cp-headlights') show = true;
        else if (filterType === 'ep' && cId === 'b-ep-ua') show = true;

        card.style.display = show ? 'flex' : 'none';
        if (show) card.classList.add('highlight-card');
        else card.classList.remove('highlight-card');
      });
    };

    if (step1Btn) step1Btn.addEventListener('click', () => updateActiveStep(step1Btn, 'eo'));
    if (step2Btn) step2Btn.addEventListener('click', () => updateActiveStep(step2Btn, 'co'));
    if (step3Btn) step3Btn.addEventListener('click', () => updateActiveStep(step3Btn, 'cp'));
    if (step4Btn) step4Btn.addEventListener('click', () => updateActiveStep(step4Btn, 'ep'));
  }

  // --- Move Notation Cheat Sheet Modal ---
  initCheatSheetModal() {
    const btnOpen = document.getElementById('btn-open-cheat-sheet');
    const modal = document.getElementById('modal-cheat-sheet');
    const btnClose = document.getElementById('btn-close-cheat-sheet');
    const btnCloseFoot = document.getElementById('btn-close-cheat-sheet-foot');

    const openModal = () => {
      if (modal) modal.style.display = 'flex';
    };
    const closeModal = () => {
      if (modal) modal.style.display = 'none';
    };

    if (btnOpen) btnOpen.addEventListener('click', openModal);
    if (btnClose) btnClose.addEventListener('click', closeModal);
    if (btnCloseFoot) btnCloseFoot.addEventListener('click', closeModal);

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
        closeModal();
      }
    });
  }

  // --- Progressive Web App (PWA) & Offline Installation ---
  initPWA() {
    // 1. Register Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').then((reg) => {
          console.log('Speedcube Pro Service Worker active:', reg.scope);
        }).catch((err) => {
          console.warn('Service Worker registration skipped:', err);
        });
      });
    }

    // 2. Install Prompts (Android, Chrome, Edge, Desktop & iOS Guide)
    let deferredPrompt = null;
    const installBtn = document.getElementById('btn-install-pwa');
    const mobileInstallBanner = document.getElementById('mobile-pwa-banner');
    const btnBannerInstall = document.getElementById('btn-banner-install');
    const btnDismissBanner = document.getElementById('btn-dismiss-pwa-banner');

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      if (installBtn) installBtn.style.display = 'inline-flex';
      if (mobileInstallBanner && !localStorage.getItem('pwa_banner_dismissed')) {
        mobileInstallBanner.style.display = 'flex';
      }
    });

    const triggerInstall = () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            if (installBtn) installBtn.style.display = 'none';
            if (mobileInstallBanner) mobileInstallBanner.style.display = 'none';
          }
          deferredPrompt = null;
        });
      } else {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        if (isIOS) {
          alert("📲 To Install Speedcube Pro on iOS:\n\n1. Tap the Share button (square with arrow ⎋) at the bottom.\n2. Scroll down and tap 'Add to Home Screen' (+).\n3. Launch Speedcube Pro as a full-screen offline app!");
        } else {
          alert("📲 Speedcube Pro is installable!\n\nUse your browser menu (⋮ or ...) and tap 'Install App' or 'Add to Home Screen' for instant full-screen offline access.");
        }
      }
    };

    if (installBtn) installBtn.addEventListener('click', triggerInstall);
    if (btnBannerInstall) btnBannerInstall.addEventListener('click', triggerInstall);
    if (btnDismissBanner) {
      btnDismissBanner.addEventListener('click', () => {
        if (mobileInstallBanner) mobileInstallBanner.style.display = 'none';
        localStorage.setItem('pwa_banner_dismissed', 'true');
      });
    }

    // Show install button if not already in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    if (!isStandalone && installBtn) {
      installBtn.style.display = 'inline-flex';
    }

    window.addEventListener('appinstalled', () => {
      if (installBtn) installBtn.style.display = 'none';
      if (mobileInstallBanner) mobileInstallBanner.style.display = 'none';
      console.log('Speedcube Pro was successfully installed!');
    });
  }

  // --- Visualizer Integration ---
  initVisualizer() {
    const canvas3d = document.getElementById('canvas-3d');
    const canvas2d = document.getElementById('canvas-2d');

    this.visualizer = new CubeVisualizer(canvas3d, canvas2d, {
      onStepChange: (step, moves, activeMoveIdx) => this.updateMovesRibbon(step, moves, activeMoveIdx)
    });

    const btnPlay = document.getElementById('vis-btn-play');
    const playText = document.getElementById('vis-play-text');
    const btnPrev = document.getElementById('vis-btn-prev');
    const btnNext = document.getElementById('vis-btn-next');
    const btnReset = document.getElementById('vis-btn-reset');
    const speedRange = document.getElementById('vis-speed-range');
    const speedLabel = document.getElementById('vis-speed-label');

    if (btnPlay) {
      btnPlay.addEventListener('click', () => {
        const isPlaying = this.visualizer.togglePlay();
        playText.innerHTML = isPlaying ? '&#10074;&#10074; Pause' : '&#9658; Play';
      });
    }

    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        this.visualizer.pause();
        playText.innerHTML = '&#9658; Play';
        this.visualizer.stepBackward();
      });
    }

    if (btnNext) {
      btnNext.addEventListener('click', () => {
        this.visualizer.pause();
        playText.innerHTML = '&#9658; Play';
        this.visualizer.stepForward(true);
      });
    }

    if (btnReset) {
      btnReset.addEventListener('click', () => {
        this.visualizer.reset();
        playText.innerHTML = '&#9658; Play';
      });
    }

    if (speedRange) {
      speedRange.addEventListener('input', (e) => {
        const ms = parseInt(e.target.value);
        this.visualizer.setSpeed(ms);
        if (speedLabel) {
          speedLabel.textContent = `${(ms / 1000).toFixed(1)}s ${ms >= 1200 ? '(Slow & Clear)' : ''}`;
        }
      });
    }

    // Wire interactive notation tester buttons
    const testMoveBtns = document.querySelectorAll('.btn-test-move');
    testMoveBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const move = btn.dataset.move;
        if (this.visualizer && move) {
          this.visualizer.visualizeSingleMove(move);
          const titleEl = document.getElementById('vis-case-title');
          const descEl = document.getElementById('vis-case-desc');
          if (titleEl) titleEl.textContent = `Move Demonstration: ${move}`;
          if (descEl) descEl.textContent = translateMoveToEnglish(move);
        }
      });
    });

    // Default benchmark case: T-Perm
    this.loadCaseIntoVisualizer(
      'T-Perm (Benchmark Adjacent Swap)',
      "(R U R' U') (R' F R2 U') (R' U' R U) (R' F')",
      "Swaps two adjacent corners and two adjacent edges. Benchmark speedcubing PLL."
    );
  }

  loadCaseIntoVisualizer(title, alg, desc = '', setup = '', howToHold = '', whatItDoes = '', badge = '') {
    const titleEl = document.getElementById('vis-case-title');
    const descEl = document.getElementById('vis-case-desc');
    if (titleEl) titleEl.textContent = title;
    if (descEl) descEl.textContent = desc;

    // Update Plain-English Helper Banner in 3D tab
    const badgeEl = document.getElementById('vis-banner-step-badge');
    const bannerTitleEl = document.getElementById('vis-banner-title');
    const holdEl = document.getElementById('vis-banner-hold');
    const algEl = document.getElementById('vis-banner-alg');
    const plainEl = document.getElementById('vis-banner-plain');

    if (badgeEl) badgeEl.textContent = badge || 'SPEEDCUBING CASE';
    if (bannerTitleEl) bannerTitleEl.textContent = title;
    if (holdEl) holdEl.textContent = howToHold || 'Hold Yellow on TOP, White on BOTTOM.';
    if (algEl) algEl.textContent = alg;
    if (plainEl) plainEl.textContent = translateMoveToEnglish(alg);

    this.visualizer.setAlgorithm(alg, setup);
    const playText = document.getElementById('vis-play-text');
    if (playText) playText.innerHTML = '&#9658; Play';
  }

  updateMovesRibbon(step, moves, activeMoveIdx = null) {
    const ribbon = document.getElementById('vis-moves-ribbon');
    if (!ribbon) return;

    if (!moves || moves.length === 0) {
      ribbon.innerHTML = '<span class="text-muted">No moves in sequence</span>';
      return;
    }

    // Determine the active pill:
    // When activeMoveIdx is provided, that move is currently animating.
    // When null and step > 0, highlight last completed move (or none if step === 0).
    const activeIndex = (activeMoveIdx !== null && activeMoveIdx !== undefined)
      ? activeMoveIdx
      : (step > 0 && step <= moves.length ? step - 1 : -1);

    const completedThreshold = (activeMoveIdx !== null && activeMoveIdx !== undefined)
      ? activeMoveIdx
      : step;

    // Check if ribbon pills need to be rebuilt (first load or new algorithm)
    const existingPills = ribbon.querySelectorAll('.move-pill');
    if (existingPills.length !== moves.length) {
      ribbon.innerHTML = '';
      moves.forEach((move, idx) => {
        const pill = document.createElement('span');
        pill.className = 'move-pill';
        pill.dataset.idx = idx;
        const plain = translateMoveToEnglish(move);
        pill.title = `Step ${idx + 1}: ${move} (${plain})`;
        pill.addEventListener('click', () => {
          this.visualizer.pause();
          const playText = document.getElementById('vis-play-text');
          if (playText) playText.innerHTML = '&#9658; Play';

          this.visualizer.reset();
          for (let i = 0; i <= idx; i++) {
            this.visualizer.stepForward(false);
          }
        });
        ribbon.appendChild(pill);
      });
    }

    // Update pill states simultaneously with 3D cube movement
    const pills = ribbon.querySelectorAll('.move-pill');
    pills.forEach((pill, idx) => {
      const move = moves[idx];
      const plain = translateMoveToEnglish(move);

      if (idx === activeIndex) {
        pill.className = 'move-pill current-move';
        pill.innerHTML = `<strong>${move}</strong> <small style="font-size: 0.72rem; opacity: 0.95;">(${plain})</small>`;
        try {
          const pillRect = pill.getBoundingClientRect();
          const ribbonRect = ribbon.getBoundingClientRect();
          const pillRelativeLeft = (pillRect.left - ribbonRect.left) + ribbon.scrollLeft;
          const pillCenter = pillRelativeLeft + (pill.offsetWidth / 2);
          const ribbonHalf = ribbon.clientWidth / 2;
          const maxScroll = Math.max(0, ribbon.scrollWidth - ribbon.clientWidth);
          const targetLeft = Math.max(0, Math.min(maxScroll, pillCenter - ribbonHalf));
          ribbon.scrollTo({
            left: targetLeft,
            behavior: 'smooth'
          });
          // Guard: Lock window horizontal scroll to 0 so the page never shifts sideways
          if (window.scrollX !== 0) {
            window.scrollTo({ left: 0 });
          }
        } catch (e) {}
      } else if (idx < completedThreshold) {
        pill.className = 'move-pill passed-move';
        pill.textContent = move;
      } else {
        pill.className = 'move-pill';
        pill.textContent = move;
      }
    });
  }

  renderVisualizerSidebar() {
    const list = document.getElementById('vis-quick-cases');
    if (!list) return;
    list.innerHTML = '';

    const popular = [
      { name: '⭐ White Cross: Daisy Drop', alg: "F2 U R2 U' B2 U2 L2", desc: 'Match side colors & drop to bottom', hold: 'Hold yellow on top, match center and turn 180°', badge: 'BEGINNER CROSS' },
      { name: '⭐ White Cross: Flipped Edge', alg: "F' U L'", desc: 'Pro 3-move flip directly into bottom cross', hold: 'Hold white on bottom, flipped edge in top-front', badge: 'PRO CFOP CROSS' },
      { name: '⭐ Step 1: Yellow Dot', alg: "F (R U R' U') F' f (R U R' U') f'", desc: 'Only center yellow', hold: 'Hold yellow on top, any side facing you', badge: 'STEP 1 • YELLOW CROSS' },
      { name: '⭐ Step 1: Yellow L-Shape', alg: "f (R U R' U') f'", desc: '2 edges meet at 9:00', hold: 'Put L in back-left (9:00 & 12:00)', badge: 'STEP 1 • YELLOW CROSS' },
      { name: '⭐ Step 1: Yellow Line', alg: "F (R U R' U') F'", desc: 'Straight bar across top', hold: 'Keep line horizontal (flat)', badge: 'STEP 1 • YELLOW CROSS' },
      { name: '⭐ Step 2: Sune / Fish', alg: "R U R' U R U2 R'", desc: '1 yellow corner oriented', hold: 'Put yellow corner at front-left (7:00)', badge: 'STEP 2 • FULL YELLOW FACE' },
      { name: '⭐ Step 3: Headlights (T-Perm)', alg: "(R U R' U') (R' F R2 U') (R' U' R U) (R' F')", desc: 'Matching corner pair', hold: 'Put headlights on the left (or back)', badge: 'STEP 3 • MATCH CORNERS' },
      { name: '⭐ Step 4: Final Edges (Ua-Perm)', alg: "R U' R U R U R U' R' U' R2", desc: '3-edge clockwise cycle', hold: 'Put solid solved side in the back', badge: 'STEP 4 • FINAL EDGES' },
      { name: '⚡ F2L: 3-Move Pair Insert', alg: "R U R'", desc: 'Connected pair into front-right slot', hold: 'Hold white on bottom, pair in U-layer', badge: 'F2L SPEED HACK' },
      { name: '⚡ F2L: Sledgehammer Insert', alg: "R' F R F'", desc: 'Inserts pair and orients yellow edges', hold: 'Hold white on bottom, pair in U-front', badge: 'PRO F2L HACK' },
      { name: '🚀 Jb Perm (Fastest PLL)', alg: "(R U R' F') (R U R' U') (R' F R2 U' R')", desc: 'Full solved bar on right', badge: 'ADVANCED PLL' },
      { name: '🚀 H-Perm (Opposite Edges)', alg: "M2 U M2 U2 M2 U M2", desc: 'Opposite edges swap with M-slice', badge: 'ADVANCED PLL' },
      { name: '🚀 Sexy Move Drill', alg: "(R U R' U')6", desc: '6x Sexy Move returns cube to solved', hold: 'Practice muscle memory', badge: 'SPEED TRIGGER' }
    ];

    popular.forEach((item, idx) => {
      const btn = document.createElement('button');
      btn.className = `quick-case-btn ${idx === 0 ? 'active' : ''}`;
      btn.innerHTML = `<span>${item.name}</span><span class="text-subtle">&rsaquo;</span>`;
      btn.addEventListener('click', () => {
        document.querySelectorAll('.quick-case-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.loadCaseIntoVisualizer(item.name, item.alg, item.desc, item.setup || '', item.hold || '', '', item.badge || '');
      });
      list.appendChild(btn);
    });
  }

  // --- Flashcard Trainer & Metronome ---
  initTrainer() {
    const container = document.getElementById('trainer-container');
    if (container) {
      this.trainer = new AlgorithmTrainer(container);
    }
  }

  // --- Algorithm Vault Rendering with 2D Diagrams & Triggers ---
  renderAlgorithms() {
    const container = document.getElementById('alg-container');
    if (!container) return;
    container.innerHTML = '';

    // Toggle F2L Pro Hacks & Cheat Sheet Banner
    const f2lBanner = document.getElementById('f2l-pro-hacks-banner');
    if (f2lBanner) {
      f2lBanner.style.display = (this.currentCategory === 'f2l') ? 'block' : 'none';
    }

    // Toggle White Cross Masterclass Banner
    const crossBanner = document.getElementById('cross-masterclass-banner');
    if (crossBanner) {
      crossBanner.style.display = (this.currentCategory === 'cross') ? 'block' : 'none';
    }

    let items = [];

    if (this.currentCategory === 'cross') {
      items = WHITE_CROSS_CASES;
      if (this.currentCrossTier && this.currentCrossTier !== 'all') {
        items = items.filter(c => c.tier === this.currentCrossTier);
      }
    } else if (this.currentCategory === 'beginner') {
      BEGINNER_LAST_LAYER.forEach(stepGroup => {
        stepGroup.cases.forEach(c => {
          items.push({
            ...c,
            groupTitle: stepGroup.name,
            recommendedAlg: c.recommendedAlg,
            qiyiAlg: c.qiyiAlg
          });
        });
      });
    } else if (this.currentCategory === 'pll') {
      items = PLL_ALGORITHMS;
    } else if (this.currentCategory === 'f2l') {
      items = F2L_CASES;
    }

    if (this.searchQuery) {
      items = items.filter(item => {
        const name = (item.name || '').toLowerCase();
        const alg = (item.recommendedAlg || item.alg || '').toLowerCase();
        const qiyi = (item.qiyiAlg || '').toLowerCase();
        return name.includes(this.searchQuery) || alg.includes(this.searchQuery) || qiyi.includes(this.searchQuery);
      });
    }

    if (items.length === 0) {
      container.innerHTML = '<div class="glass-panel text-muted" style="padding: 40px; text-align: center; grid-column: 1 / -1;">No algorithms match your search.</div>';
      return;
    }

    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'alg-card glass-panel';

      const algCode = item.recommendedAlg || item.alg;
      const qiyiCode = item.qiyiAlg || '';
      const status = this.masteryState[item.id] || 'to-learn';

      // Generate 2D SVG Diagram
      let diagramSvg = '';
      if (item.diagramConfig) {
        if (item.diagramConfig.pllArrows) {
          diagramSvg = DiagramGenerator.renderPLLSVG(item.diagramConfig, 90);
        } else {
          diagramSvg = DiagramGenerator.renderOLLSVG(item.diagramConfig, 90);
        }
      } else {
        diagramSvg = `<div class="card-diagram-placeholder">${item.group || 'CFOP'}</div>`;
      }

      // Format triggers
      let triggersHtml = '';
      if (item.triggers && item.triggers.length > 0) {
        triggersHtml = `
          <div class="triggers-list">
            ${item.triggers.map(t => `<span class="trigger-pill" title="${t.code}">${t.name}</span>`).join('')}
          </div>
        `;
      }

      // Descriptive badge
      let badgeLabel = item.badge || item.category || item.type || item.group || 'CFOP';
      if (item.type === 'EO') badgeLabel = 'EO • Edge Orientation (Cross)';
      else if (item.type === 'CO') badgeLabel = 'CO • Corner Orientation (Yellow Face)';
      else if (item.type === 'CP') badgeLabel = 'CP • Corner Permutation (Headlights)';
      else if (item.type === 'EP') badgeLabel = 'EP • Edge Permutation (Final Edges)';
      else if (item.tier === 'beginner') badgeLabel = '🌱 ABSOLUTE BEGINNER • THE DAISY';
      else if (item.tier === 'intermediate') badgeLabel = '⚡ INTERMEDIATE • BOTTOM CROSS';
      else if (item.tier === 'pro') badgeLabel = '🚀 PRO & ADVANCED • SUB-20 CFOP';

      card.innerHTML = `
        <div class="alg-card-top">
          <div class="alg-card-top-left">
            <div class="alg-title">${item.name}</div>
            <span class="alg-badge">${badgeLabel}</span>
          </div>
          <div class="alg-card-diagram-thumb">
            ${diagramSvg}
          </div>
        </div>

        ${triggersHtml}

        <div class="alg-formula-box">
          <span class="formula-label">Speedcubing Alg:</span>
          <div class="formula-code">${algCode}</div>
          <div class="formula-plain-words">🗣️ ${translateMoveToEnglish(algCode)}</div>
          ${qiyiCode ? `<span class="formula-label" style="margin-top: 6px;">QiYi Booklet:</span><div class="formula-qiyi">${qiyiCode}</div>` : ''}
        </div>

        ${item.howToHold ? `
          <div class="how-to-hold-box">
            <span class="hold-label">🧭 How to hold your cube:</span>
            ${item.howToHold}
          </div>
        ` : ''}

        ${item.whatItDoes ? `
          <div class="what-it-does-box">
            <span>💡 Goal: ${item.whatItDoes}</span>
          </div>
        ` : ''}

        <div class="alg-notes">
          ${item.recognition ? `<strong>Recognition:</strong> ${item.recognition}<br>` : ''}
          ${item.notes || item.intuition || item.speedTip || ''}
        </div>

        <div class="alg-card-footer">
          <div class="footer-left">
            <button class="mastery-btn status-${status}" data-id="${item.id}">
              ${status === 'mastered' ? '&#10003; Mastered' : (status === 'learning' ? '&#9679; Learning' : '+ To Learn')}
            </button>
            ${item.setup ? `<button class="btn-setup-copy" title="Copy setup moves to practice on real cube" data-setup="${item.setup}">Real Cube Setup</button>` : ''}
          </div>
          <button class="practice-btn" data-alg="${algCode}" data-name="${item.name}">
            Practice in 3D &rarr;
          </button>
        </div>
      `;

      // Wire mastery button
      const masteryBtn = card.querySelector('.mastery-btn');
      masteryBtn.addEventListener('click', () => {
        const nextStatus = status === 'to-learn' ? 'learning' : (status === 'learning' ? 'mastered' : 'to-learn');
        this.masteryState[item.id] = nextStatus;
        this.saveMasteryState();
        this.renderAlgorithms();
      });

      // Wire Copy Setup Scramble button
      const setupBtn = card.querySelector('.btn-setup-copy');
      if (setupBtn) {
        setupBtn.addEventListener('click', () => {
          const setupMoves = setupBtn.dataset.setup;
          navigator.clipboard.writeText(setupMoves).then(() => {
            setupBtn.textContent = 'Copied!';
            setTimeout(() => { setupBtn.textContent = 'Real Cube Setup'; }, 1500);
          }).catch(() => {
            prompt('Scramble on a solved cube to get this case:', setupMoves);
          });
        });
      }

      // Wire Practice in 3D button
      const practiceBtn = card.querySelector('.practice-btn');
      practiceBtn.addEventListener('click', () => {
        this.switchTab('visualizer');
        this.loadCaseIntoVisualizer(
          item.name,
          algCode,
          item.notes || item.intuition || item.recognition || '',
          item.setup || '',
          item.howToHold || 'Hold Yellow on TOP, White on BOTTOM.',
          item.whatItDoes || '',
          badgeLabel
        );
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => {
          if (this.visualizer) {
            this.visualizer.play();
            const playText = document.getElementById('vis-play-text');
            if (playText) playText.innerHTML = '&#10074;&#10074; Pause';
          }
        }, 350);
      });

      container.appendChild(card);
    });
  }

  // --- Speed Timer Integration ---
  initTimer() {
    const elements = {
      display: document.getElementById('timer-digits'),
      scramble: document.getElementById('timer-scramble-display'),
      scrambleNet: document.getElementById('timer-scramble-net'),
      status: document.getElementById('timer-status'),
      ao5: document.getElementById('stat-ao5'),
      ao12: document.getElementById('stat-ao12'),
      best: document.getElementById('stat-best'),
      historyList: document.getElementById('timer-history-list'),
      chartCanvas: document.getElementById('timer-chart-canvas')
    };

    this.timer = new SpeedTimer(elements);

    const btnNewScramble = document.getElementById('timer-btn-new-scramble');
    if (btnNewScramble) {
      btnNewScramble.addEventListener('click', () => {
        this.timer.generateNewScramble();
      });
    }

    const btnClear = document.getElementById('timer-btn-clear');
    if (btnClear) {
      btnClear.addEventListener('click', () => {
        this.timer.clearAllSolves();
      });
    }

    const chkInspection = document.getElementById('chk-use-inspection');
    if (chkInspection) {
      chkInspection.addEventListener('change', (e) => {
        this.timer.useInspection = e.target.checked;
      });
    }

    const chkSound = document.getElementById('chk-use-sound');
    if (chkSound) {
      chkSound.addEventListener('change', (e) => {
        this.timer.useSound = e.target.checked;
      });
    }
  }

  // --- Roadmap Persistence ---
  initRoadmapChecklist() {
    const checkboxes = document.querySelectorAll('.stage-checklist input[type="checkbox"]');
    checkboxes.forEach(chk => {
      const saved = localStorage.getItem(`chk_${chk.id}`);
      if (saved !== null) {
        chk.checked = saved === 'true';
      }

      chk.addEventListener('change', () => {
        localStorage.setItem(`chk_${chk.id}`, chk.checked);
      });
    });
  }

  loadMasteryState() {
    try {
      const data = localStorage.getItem('speedcube_mastery');
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  saveMasteryState() {
    try {
      localStorage.setItem('speedcube_mastery', JSON.stringify(this.masteryState));
    } catch (e) {
      console.warn('Failed to save mastery state', e);
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
