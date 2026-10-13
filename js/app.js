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
import { Cube } from './cube-engine.js';
import { STAGES, LEVELS, getLessonCases, nextLesson } from './curriculum.js';

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
    this.currentCategory = 'cross';
    this.currentLevel = 'beginner';
    this.lessonProgress = {};
    try {
      const saved = JSON.parse(localStorage.getItem('cubepro_learning') || '{}');
      if (STAGES[saved.stage]) this.currentCategory = saved.stage;
      if (LEVELS.includes(saved.level)) this.currentLevel = saved.level;
      this.lessonProgress = saved.progress && typeof saved.progress === 'object' ? saved.progress : {};
    } catch { /* Start with the first lesson if saved data is unreadable. */ }
    this.searchQuery = '';
    this.masteryState = this.loadMasteryState();

    this.visualizer = null;
    this.timer = null;
    this.trainer = null;

    this.init();
  }

  init() {
    this.initTheme();
    this.initNavigation();
    this.initVisualizer();
    this.initCurriculum();
    this.initCheatSheetModal();
    this.initTrainer();
    this.initTimer();
    this.initPWA();
    this.renderAlgorithms();
    this.renderVisualizerSidebar();
  }

  // --- Theme Management (Light / Dark Mode) ---
  initTheme() {
    const savedTheme = localStorage.getItem('cubepro_theme') || 'dark';
    this.applyTheme(savedTheme);

    const toggleBtn = document.getElementById('btn-theme-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(nextTheme);
      });
    }
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('cubepro_theme', theme);

    const iconEl = document.getElementById('theme-toggle-icon');
    const labelEl = document.querySelector('.theme-toggle-text');
    if (iconEl) {
      iconEl.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
    if (labelEl) {
      labelEl.textContent = theme === 'dark' ? 'Light' : 'Dark';
    }

    const toggleBtn = document.getElementById('btn-theme-toggle');
    if (toggleBtn) {
      toggleBtn.setAttribute('title', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
      toggleBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    }
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

    // Search input
    const searchInput = document.getElementById('alg-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderAlgorithms();
      });
    }

  }

  switchTab(tabId, category = null) {
    if (tabId === 'roadmap') tabId = 'algorithms';
    if (tabId !== 'visualizer') this.visualizer?.pause();
    if (tabId !== 'trainer' && this.trainer?.isMetronomeRunning) this.trainer.toggleMetronome();
    document.querySelectorAll('.nav-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.tab === tabId);
      t.setAttribute('aria-current', t.dataset.tab === tabId ? 'page' : 'false');
    });

    document.querySelectorAll('.mobile-nav-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.tab === tabId);
      b.setAttribute('aria-current', b.dataset.tab === tabId ? 'page' : 'false');
    });

    document.querySelectorAll('.tab-pane').forEach(p => {
      p.classList.toggle('active', p.id === `tab-${tabId}`);
    });

    if (tabId === 'algorithms' && category) this.selectLesson(category === 'beginner' ? 'oll' : category, this.currentLevel);

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

  initCurriculum() {
    document.querySelectorAll('[data-stage]').forEach(button => button.addEventListener('click', () => this.selectLesson(button.dataset.stage, this.currentLevel)));
    document.querySelectorAll('[data-level]').forEach(button => button.addEventListener('click', () => this.selectLesson(this.currentCategory, button.dataset.level)));
    this.renderLesson();
  }

  saveLearning() {
    try { localStorage.setItem('cubepro_learning', JSON.stringify({ stage: this.currentCategory, level: this.currentLevel, progress: this.lessonProgress })); }
    catch { document.getElementById('lesson-save-status').textContent = 'Progress could not be saved on this device.'; }
  }

  selectLesson(stage, level) {
    if (!STAGES[stage] || !LEVELS.includes(level)) return;
    this.currentCategory = stage; this.currentLevel = level; this.searchQuery = '';
    document.getElementById('alg-search-input').value = '';
    this.renderLesson(); this.renderAlgorithms(); this.renderVisualizerSidebar(); this.saveLearning();
  }

  renderLesson() {
    const stage = STAGES[this.currentCategory], lesson = stage.levels[this.currentLevel];
    const key = this.currentCategory + ':' + this.currentLevel;
    document.querySelectorAll('[data-stage]').forEach(b => { const active = b.dataset.stage === this.currentCategory; b.classList.toggle('active', active); b.setAttribute('aria-pressed', active); });
    document.querySelectorAll('[data-level]').forEach(b => { const active = b.dataset.level === this.currentLevel; b.classList.toggle('active', active); b.setAttribute('aria-pressed', active); });
    document.getElementById('lesson-position').textContent = stage.name + ' / ' + this.currentLevel;
    const done = Object.keys(STAGES).flatMap(s => LEVELS.map(l => s + ':' + l)).filter(k => this.lessonProgress[k] === true).length;
    document.getElementById('learning-progress').value = done;
    document.getElementById('learning-progress-text').textContent = done + ' of 12 lessons practiced';
    const next = nextLesson(this.currentCategory, this.currentLevel);
    document.getElementById('lesson-content').innerHTML = `
      <div class="lesson-main"><span class="eyebrow">${stage.name.toUpperCase()} · ${this.currentLevel.toUpperCase()}</span><h3>${lesson.title}</h3><p class="lesson-goal">${stage.goal}</p><ol>${lesson.steps.map(step => '<li>' + step + '</li>').join('')}</ol></div>
      <aside class="lesson-drill"><span class="eyebrow">YOUR NEXT PRACTICE</span><p>${lesson.drill}</p><h4>Ready to move on?</h4><p class="text-muted">${lesson.ready}</p><label class="lesson-check"><input id="lesson-done" type="checkbox" ${this.lessonProgress[key] ? 'checked' : ''}> I practiced this lesson</label><small>Self-reported practice, not an automatic skill assessment.</small><button id="lesson-drill" class="btn btn-secondary">Drill this lesson</button><button id="lesson-next" class="btn btn-primary">Next: ${STAGES[next.stage].name} · ${next.level} →</button><span id="lesson-save-status" role="status"></span></aside>
      ${lesson.reference ? '<div class="coverage-note"><p>' + lesson.coverage + '</p><a target="_blank" rel="noopener" href="' + lesson.reference[1] + '">' + lesson.reference[0] + ' ↗</a></div>' : ''}
    `;
    document.getElementById('lesson-drill').addEventListener('click', () => { this.trainer.setLesson(this.currentCategory, this.currentLevel); this.switchTab('trainer'); });
    document.getElementById('lesson-done').addEventListener('change', e => { this.lessonProgress[key] = e.target.checked; this.saveLearning(); this.renderLesson(); });
    document.getElementById('lesson-next').addEventListener('click', () => { this.selectLesson(next.stage, next.level); document.getElementById('lesson-content').scrollIntoView({ block: 'start' }); });
  }

  // --- Move Notation Cheat Sheet Modal ---
  initCheatSheetModal() {
    const btnOpen = document.getElementById('btn-open-cheat-sheet');
    const modal = document.getElementById('modal-cheat-sheet');
    const btnClose = document.getElementById('btn-close-cheat-sheet');
    const btnCloseFoot = document.getElementById('btn-close-cheat-sheet-foot');

    const openModal = () => {
      if (modal) { this.visualizer.pause(); modal.showModal(); }
    };
    const closeModal = () => {
      if (modal) modal.close();
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
      if (e.key === 'Escape' && modal && modal.open) {
        closeModal();
      }
    });
  }

  // --- Progressive Web App (PWA) & Offline Installation ---
  initPWA() {
    // 1. Register Service Worker
    if ('serviceWorker' in navigator && !new URLSearchParams(location.search).has('dev')) {
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
      onStepChange: (step, moves, activeMoveIdx) => this.updateMovesRibbon(step, moves, activeMoveIdx),
      onStateChange: state => this.updatePlaybackState(state)
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
        this.visualizer.togglePlay();
      });
    }

    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        this.visualizer.pause();
        this.visualizer.stepBackward();
      });
    }

    if (btnNext) {
      btnNext.addEventListener('click', () => {
        this.visualizer.pause();
        this.visualizer.stepForward(true);
      });
    }

    if (btnReset) {
      btnReset.addEventListener('click', () => {
        this.visualizer.reset();
      });
    }

    if (speedRange) {
      speedRange.addEventListener('input', (e) => {
        const ms = parseInt(e.target.value);
        this.visualizer.setSpeed(ms);
        if (speedLabel) {
          speedLabel.textContent = (ms / 1000).toFixed(1) + 's / move';
        }
      });
    }

    // Wire interactive notation tester buttons
    const testMoveBtns = document.querySelectorAll('.btn-test-move');
    testMoveBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const move = btn.dataset.move;
        if (this.visualizer && move) {
          this.loadCaseIntoVisualizer('Move demonstration: ' + move, move, 'A separate sequence starting from a solved cube.', '', 'Watch the moving layer. Dragging changes your view, not the moves.', '', 'NOTATION EXPLORER', true);
          this.visualizer.play();
          const titleEl = document.getElementById('vis-case-title');
          const descEl = document.getElementById('vis-case-desc');
          if (titleEl) titleEl.textContent = `Move Demonstration: ${move}`;
          if (descEl) descEl.textContent = translateMoveToEnglish(move);
        }
      });
    });

    document.getElementById('vis-restore-view').addEventListener('click', () => this.visualizer.restoreView());
    document.getElementById('vis-back-learn').addEventListener('click', () => this.switchTab('algorithms'));
    document.getElementById('vis-return-case').addEventListener('click', () => {
      if (this.savedCase) this.loadCaseIntoVisualizer(...this.savedCase);
    });
    this.openCase(getLessonCases(this.currentCategory, this.currentLevel)[0]);
  }

  updatePlaybackState({ playing, animating, step, total }) {
    const label = document.getElementById('vis-play-text');
    if (label) label.textContent = playing ? 'Ⅱ Pause' : step === total && total ? '↻ Replay' : '▶ Play';
    document.getElementById('vis-btn-play').disabled = !total;
    document.getElementById('vis-btn-prev').disabled = !step && !animating;
    document.getElementById('vis-btn-next').disabled = animating || step >= total;
    document.getElementById('vis-step-status').textContent = animating ? 'Turning move ' + (step + 1) + ' of ' + total : step === total && total ? 'Sequence complete · ' + total + ' moves' : 'Move ' + step + ' of ' + total;
  }

  openCase(item) {
    this.activeCaseId = item.id;
    this.loadCaseIntoVisualizer(item.name, item.recommendedAlg || item.alg, item.whatItDoes || item.intuition || item.notes || '', item.setup || '', item.howToHold || 'Yellow on top, white on bottom. Match the preview before starting.', '', STAGES[this.currentCategory].name.toUpperCase() + ' PRACTICE');
    this.renderVisualizerSidebar();
  }

  loadCaseIntoVisualizer(title, alg, desc = '', setup = '', howToHold = '', whatItDoes = '', badge = '', demonstration = false) {
    const error = document.getElementById('vis-error');
    try { this.visualizer.setAlgorithm(alg, setup, demonstration); error.hidden = true; }
    catch (e) { error.textContent = e.message; error.hidden = false; return; }
    if (!demonstration) this.savedCase = [title, alg, desc, setup, howToHold, whatItDoes, badge];
    document.getElementById('vis-return-case').hidden = !demonstration;
    this.visualizer.restoreView();
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

    const playText = document.getElementById('vis-play-text');
    if (playText) playText.innerHTML = '&#9658; Play';
  }

  updateMovesRibbon(step, moves, activeMoveIdx = null) {
    document.getElementById('vis-current-move').textContent = activeMoveIdx !== null ? moves[activeMoveIdx] + ' · ' + translateMoveToEnglish(moves[activeMoveIdx]) : '';
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
        const pill = document.createElement('button');
        pill.type = 'button';
        pill.className = 'move-pill';
        pill.dataset.idx = idx;
        const plain = translateMoveToEnglish(move);
        pill.title = `Step ${idx + 1}: ${move} (${plain})`;
        pill.addEventListener('click', () => {
          this.visualizer.pause();
          const playText = document.getElementById('vis-play-text');
          if (playText) playText.innerHTML = '&#9658; Play';

          this.visualizer.seek(idx + 1);
        });
        ribbon.appendChild(pill);
      });
    }

    // Update pill states simultaneously with 3D cube movement
    const pills = ribbon.querySelectorAll('.move-pill');
    pills.forEach((pill, idx) => {
      const move = moves[idx];
      const plain = translateMoveToEnglish(move);
      pill.title = 'Step ' + (idx + 1) + ': ' + move + ' (' + plain + ')';
      pill.setAttribute('aria-label', 'Jump to after move ' + (idx + 1) + ': ' + move);
      pill.setAttribute('aria-current', idx === activeIndex ? 'step' : 'false');

      if (idx === activeIndex) {
        pill.className = 'move-pill current-move';
        pill.textContent = move;
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
    list.replaceChildren();
    for (const item of getLessonCases(this.currentCategory, this.currentLevel)) {
      const button = document.createElement('button');
      button.className = 'quick-case-btn' + (item.id === this.activeCaseId ? ' active' : '');
      button.textContent = item.name;
      button.setAttribute('aria-pressed', item.id === this.activeCaseId);
      button.addEventListener('click', () => this.openCase(item));
      list.appendChild(button);
    }
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

    let items = getLessonCases(this.currentCategory, this.currentLevel);
    const total = items.length;
    if (this.searchQuery) {
      items = items.filter(item => {
        const name = (item.name || '').toLowerCase();
        const alg = (item.recommendedAlg || item.alg || '').toLowerCase();
        const qiyi = (item.qiyiAlg || '').toLowerCase();
        return name.includes(this.searchQuery) || alg.includes(this.searchQuery) || qiyi.includes(this.searchQuery);
      });
    }

    document.getElementById('case-library-title').textContent = STAGES[this.currentCategory].name + ' practice cases';
    document.getElementById('case-library-count').textContent = items.length + ' of ' + total + ' cases · Preview, practice, then test your recall';
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

      const preview = new Cube();
      preview.applyAlgorithm(item.setup || Cube.invertAlgorithm(algCode));
      const diagramSvg = DiagramGenerator.renderFlatNet(preview, 150, 112);

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
          <span class="formula-label">Practice sequence:</span>
          <div class="formula-code">${algCode}</div>

          
        </div>

        <details class="case-details"><summary>Hold &amp; learning notes</summary>
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

        </details>
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
        this.openCase(item);
        window.scrollTo({ top: 0, behavior: 'auto' });
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
