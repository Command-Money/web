let policyText = "";
const state = { score: 0, oop: 0, fixes: [], finePrint: [] };
const fileInput = document.getElementById('policyFile');
const chooseBtn = document.getElementById('chooseFileBtn');
const analyzeBtn = document.getElementById('analyzeBtn');
const fileName = document.getElementById('fileName');
const stepUpload = document.getElementById('step-upload');
const stepProcessing = document.getElementById('step-processing');
const stepResults = document.getElementById('step-results');
const heroSignupBtn = document.getElementById('heroSignupBtn');
const navSignupBtn = document.getElementById('navSignupBtn');
const walletSignupFrontBtn = document.getElementById('walletSignupFrontBtn');
const walletSignupBackBtn = document.getElementById('walletSignupBackBtn');
const heroConsoleState = document.getElementById('heroConsoleState');
let productDemoTimer = null;
let heroConsoleTimer = null;

window.addEventListener('DOMContentLoaded', () => {
  initFramerBackground();

  // Navbar slide-in
  gsap.fromTo(".navbar", { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" });

  // Hero card shell
  gsap.fromTo(".hero-banner-card", { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, delay: 0.15, ease: "power3.out" });

  // Hero intro cascade
  gsap.fromTo(".hero-kicker", { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, delay: 0.35, ease: "power3.out" });
  gsap.fromTo("#take-text",  { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.58, delay: 0.42, ease: "power3.out" });
  gsap.fromTo("#hero-logo",  { scale: 0, rotation: -80 }, { scale: 1, rotation: 0, duration: 0.68, delay: 0.55, ease: "back.out(2)" });
  gsap.fromTo("#cmd-text",   { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.58, delay: 0.64, ease: "power3.out" });
  gsap.fromTo(".hero-subtitle", { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, delay: 0.74, ease: "power3.out" });
  gsap.fromTo(".hero-cta-row", { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, delay: 0.84, ease: "power3.out" });
  gsap.fromTo(".hero-visual-shell", { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, delay: 0.96, ease: "power3.out" });

  // Landing container fade-in (non-blocking so children animate independently)
  const landing = document.getElementById('landing-container');
  gsap.set(landing, { opacity: 1 });

  initFlipCards();
  initSignupButtons();
  initHeroLivePanel();
  initNavScrollState();
  initHeroParallax();
  initCardHoverPhysics();
  initScrollReveals();
});

function initFramerBackground() {
  const scene = document.querySelector('.bg-scene');
  if (!scene) return;

  const motionApi = window.Motion;
  if (!motionApi || typeof motionApi.animate !== 'function') return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const { animate } = motionApi;
  const orbs = Array.from(document.querySelectorAll('[data-bg-orb]'));

  orbs.forEach((orb, index) => {
    const xRange = [0, index % 2 === 0 ? 38 : -32, 0];
    const yRange = [0, index === 1 ? -34 : 28, 0];
    const scaleRange = [1, index === 2 ? 1.13 : 1.09, 1];

    animate(
      orb,
      { transform: [
        'translate3d(0px, 0px, 0px) scale(1)',
        `translate3d(${xRange[1]}px, ${yRange[1]}px, 0px) scale(${scaleRange[1]})`,
        'translate3d(0px, 0px, 0px) scale(1)'
      ] },
      {
        duration: 14 + index * 3,
        repeat: Infinity,
        easing: 'ease-in-out',
        delay: index * 0.4
      }
    );
  });

  const particlesWrap = document.getElementById('bgParticles');
  if (!particlesWrap) return;

  const particleCount = window.matchMedia('(max-width: 768px)').matches ? 12 : 20;

  for (let i = 0; i < particleCount; i += 1) {
    const particle = document.createElement('span');
    particle.className = 'bg-particle';
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.opacity = `${0.2 + Math.random() * 0.65}`;
    particlesWrap.appendChild(particle);

    const driftX = (Math.random() * 60 - 30).toFixed(1);
    const driftY = (Math.random() * 70 - 35).toFixed(1);
    const duration = 10 + Math.random() * 12;

    animate(
      particle,
      {
        transform: [
          'translate3d(0px, 0px, 0px) scale(1)',
          `translate3d(${driftX}px, ${driftY}px, 0px) scale(1.26)`,
          'translate3d(0px, 0px, 0px) scale(1)'
        ],
        opacity: [Number(particle.style.opacity), 0.08, Number(particle.style.opacity)]
      },
      {
        duration,
        repeat: Infinity,
        easing: 'ease-in-out',
        delay: Math.random() * 4
      }
    );
  }
}

function handleEarlyAccessSignup() {
  window.location.href = 'mailto:hello@takecommand.app?subject=Early%20Access%20Signup';
}

function initSignupButtons() {
  navSignupBtn?.addEventListener('click', handleEarlyAccessSignup);
  heroSignupBtn?.addEventListener('click', handleEarlyAccessSignup);
  walletSignupFrontBtn?.addEventListener('click', handleEarlyAccessSignup);
  walletSignupBackBtn?.addEventListener('click', handleEarlyAccessSignup);
}

function initNavScrollState() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const sync = () => {
    navbar.classList.toggle('is-scrolled', window.scrollY > 10);
  };

  sync();
  window.addEventListener('scroll', sync, { passive: true });
}

function initHeroLivePanel() {
  const stepDots = Array.from(document.querySelectorAll('.step-dot'));
  const connectors = Array.from(document.querySelectorAll('.step-connector'));
  const stepLabel = document.getElementById('heroStepLabel');
  const savingsFill = document.getElementById('heroSavingsFill');
  const savingsAmount = document.getElementById('heroSavingsAmount');
  const actionCards = Array.from(document.querySelectorAll('.action-card-item'));

  if (!stepDots.length) return;

  const stageFlow = [
    { label: 'Syncing AA feeds', reset: true, dwell: 1300 },
    { label: 'Mapping cashflow', reset: true, dwell: 1300 },
    { label: 'Checking risk drift', reset: true, dwell: 1300 },
    { label: 'Optimizing money', dwell: 5200, optimize: { saved: 82000, savedFill: 92 } },
    { label: 'Action queue ready', dwell: 1800, hold: true }
  ];

  const stages = stageFlow.slice(0, stepDots.length);
  if (!stages.length) return;

  const formatINR = (value) => `Rs ${Math.round(value).toLocaleString('en-IN')}`;
  let savingsCurrent = 0;

  const resetActionCards = () => {
    if (!actionCards.length) return;
    actionCards.forEach((card) => card.classList.remove('is-generated'));
    gsap.set(actionCards, { opacity: 0, y: 7, scale: 0.985 });
  };

  const animateActionCards = () => {
    if (!actionCards.length) return;
    resetActionCards();

    const tl = gsap.timeline({ delay: 0.18 });
    actionCards.forEach((card, idx) => {
      const at = idx * 0.72;
      tl.to(card, { opacity: 1, y: 0, scale: 1, duration: 0.28, ease: 'power2.out' }, at);
      tl.add(() => card.classList.add('is-generated'), at + 0.03);
    });
  };

  const updateIndicators = ({ targetSaved, targetSavedFill, duration }) => {
    if (savingsFill && savingsAmount) {
      gsap.to(savingsFill, {
        width: `${targetSavedFill}%`,
        duration,
        ease: 'power2.out'
      });

      const savedTween = { val: savingsCurrent };
      gsap.to(savedTween, {
        val: targetSaved,
        duration,
        ease: 'power2.out',
        onUpdate: () => {
          savingsAmount.textContent = formatINR(savedTween.val);
        },
        onComplete: () => {
          savingsCurrent = targetSaved;
        }
      });
    }
  };

  const updateStepDots = (activeIdx) => {
    stepDots.forEach((dot, i) => {
      dot.classList.remove('is-active', 'is-done');
      if (i < activeIdx) dot.classList.add('is-done');
      else if (i === activeIdx) dot.classList.add('is-active');
    });
    connectors.forEach((c, i) => {
      c.classList.toggle('is-done', i < activeIdx);
    });
  };

  updateStepDots(0);
  if (stepLabel) stepLabel.textContent = stages[0].label;
  if (heroConsoleState) heroConsoleState.textContent = 'Working while you sleep';
  resetActionCards();
  updateIndicators({ targetSaved: 0, targetSavedFill: 0, duration: 0.35 });

  let activeIdx = 0;
  if (heroConsoleTimer) {
    clearTimeout(heroConsoleTimer);
  }

  const advanceStage = () => {
    const stage = stages[activeIdx];
    updateStepDots(activeIdx);
    if (stepLabel) {
      gsap.to(stepLabel, { opacity: 0, duration: 0.15, onComplete: () => {
        stepLabel.textContent = stage.label;
        gsap.to(stepLabel, { opacity: 1, duration: 0.25 });
      }});
    }

    if (stage.optimize) {
      updateIndicators({
        targetSaved: stage.optimize.saved,
        targetSavedFill: stage.optimize.savedFill,
        duration: 4.2
      });
      animateActionCards();
    } else if (stage.reset) {
      updateIndicators({
        targetSaved: 0,
        targetSavedFill: 0,
        duration: 0.35
      });
      resetActionCards();
    }

    const wait = stage.dwell || 1400;
    heroConsoleTimer = setTimeout(() => {
      activeIdx = (activeIdx + 1) % stages.length;
      advanceStage();
    }, wait);
  };

  advanceStage();
}

function initHeroParallax() {
  const hero = document.getElementById('heroText');
  const copyCol = hero?.querySelector('.hero-copy-col');
  const visualCol = hero?.querySelector('.hero-visual-shell');

  if (!hero || !copyCol || !visualCol) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const moveCopyX = gsap.quickTo(copyCol, 'x', { duration: 0.55, ease: 'power3.out' });
  const moveCopyY = gsap.quickTo(copyCol, 'y', { duration: 0.55, ease: 'power3.out' });
  const moveVisualX = gsap.quickTo(visualCol, 'x', { duration: 0.62, ease: 'power3.out' });
  const moveVisualY = gsap.quickTo(visualCol, 'y', { duration: 0.62, ease: 'power3.out' });

  hero.addEventListener('pointermove', (e) => {
    const rect = hero.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;

    moveCopyX(px * -12);
    moveCopyY(py * -8);
    moveVisualX(px * 22);
    moveVisualY(py * 14);
  });

  hero.addEventListener('pointerleave', () => {
    moveCopyX(0);
    moveCopyY(0);
    moveVisualX(0);
    moveVisualY(0);
  });
}

function initCardHoverPhysics() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const cards = Array.from(document.querySelectorAll('.flip-card'));

  cards.forEach((card) => {
    card.addEventListener('pointerenter', stopProductDemo, { once: true });

    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(card, {
        rotateY: px * 10,
        rotateX: py * -10,
        y: -10,
        duration: 0.36,
        ease: 'power3.out',
        overwrite: 'auto'
      });
    });

    card.addEventListener('pointerleave', () => {
      gsap.to(card, {
        rotateY: 0,
        rotateX: 0,
        y: 0,
        duration: 0.82,
        ease: 'elastic.out(1, 0.55)',
        overwrite: 'auto'
      });
    });
  });
}

function initScrollReveals() {
  const revealSections = Array.from(document.querySelectorAll('[data-reveal]'));
  const modulesSection = document.getElementById('modulesSection');
  let demoFallbackTimer = null;

  if (!revealSections.length) {
    startProductDemo();
    return;
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealSections.forEach((section) => {
      section.style.opacity = '1';
      section.style.transform = 'none';
      section.style.filter = 'none';
    });

    const dashboardSection = document.getElementById('dashboardSection');
    if (dashboardSection) runCountups(dashboardSection);

    const moduleHeader = modulesSection?.querySelector('.tools-header');
    const moduleCards = modulesSection?.querySelectorAll('.flip-card') || [];
    if (moduleHeader) moduleHeader.style.opacity = '1';
    moduleCards.forEach((card) => {
      card.style.opacity = '1';
      card.style.transform = 'none';
    });
    startProductDemo();
    return;
  }

  demoFallbackTimer = setTimeout(() => startProductDemo(), 2600);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const section = entry.target;
      const revealType = section.dataset.reveal;

      if (revealType === 'value-strip') {
        const panel = section.querySelector('.secondary-hero-inner');
        const blocks = section.querySelectorAll('.secondary-hero-block');
        const divider = section.querySelector('.secondary-hero-divider');
        if (panel) gsap.set(panel, { opacity: 0, y: 22, scale: 0.985 });
        gsap.set(blocks, { opacity: 0, y: 16 });
        if (divider) gsap.set(divider, { scaleY: 0, opacity: 0 });

        const tl = gsap.timeline();
        tl.to(panel, { opacity: 1, y: 0, scale: 1, duration: 0.62, ease: 'power3.out' })
          .to(blocks[0], { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
          .to(divider, { scaleY: 1, opacity: 1, duration: 0.4, ease: 'power2.out' }, '-=0.2')
          .to(blocks[1], { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2');
      } else if (revealType === 'dashboard') {
        const heading = section.querySelector('.section-heading');
        const cards = section.querySelectorAll('.board-manifesto-card, .board-ops-card');
        gsap.set(heading, { opacity: 0, y: 18 });
        gsap.set(cards, { opacity: 0, y: 24, scale: 0.985 });

        gsap.timeline()
          .to(heading, { opacity: 1, y: 0, duration: 0.44, ease: 'power2.out' })
          .to(cards, { opacity: 1, y: 0, scale: 1, duration: 0.52, stagger: 0.1, ease: 'power3.out' }, '-=0.18')
          .add(() => runCountups(section));
      } else if (revealType === 'proof-band') {
        const cards = section.querySelectorAll('.proof-band-card');
        gsap.set(cards, { opacity: 0, y: 18, scale: 0.99 });

        gsap.to(cards, { opacity: 1, y: 0, scale: 1, duration: 0.44, stagger: 0.08, ease: 'power2.out' });
      } else if (revealType === 'modules') {
        const header = section.querySelector('.tools-header');
        const cards = section.querySelectorAll('.flip-card');
        gsap.set(header, { opacity: 0, y: 14 });
        gsap.set(cards, { opacity: 0, y: 28, scale: 0.985 });

        const tl = gsap.timeline();
        tl.to(header, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' })
          .to(cards, { opacity: 1, y: 0, scale: 1, duration: 0.55, stagger: 0.1, ease: 'power3.out' }, '-=0.18')
          .add(() => {
            if (demoFallbackTimer) {
              clearTimeout(demoFallbackTimer);
              demoFallbackTimer = null;
            }
            startProductDemo();
          });
      } else if (revealType === 'security') {
        const heading = section.querySelector('.section-heading');
        const panels = section.querySelectorAll('.security-panel');
        gsap.set(heading, { opacity: 0, y: 18 });
        gsap.set(panels, { opacity: 0, y: 22, scale: 0.985 });

        gsap.timeline()
          .to(heading, { opacity: 1, y: 0, duration: 0.42, ease: 'power2.out' })
          .to(panels, { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out' }, '-=0.16');
      } else if (revealType === 'cta') {
        const shell = section.querySelector('.cta-shell');
        gsap.set(shell, { opacity: 0, y: 22, scale: 0.99 });
        gsap.to(shell, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out' });
      } else if (revealType === 'trust-tail') {
        const marquee = section.querySelector('.trust-marquee');
        if (marquee) {
          gsap.set(marquee, { opacity: 0, y: 16 });
          gsap.to(marquee, { opacity: 1, y: 0, duration: 0.42, ease: 'power2.out' });
        }
      } else {
        gsap.to(section, { opacity: 1, duration: 0.3, ease: 'power2.out' });
      }

      observer.unobserve(section);
    });
  }, { threshold: 0.18 });

  revealSections.forEach((section) => observer.observe(section));
}

function runCountups(container) {
  const nodes = Array.from(container.querySelectorAll('[data-countup]'));
  if (!nodes.length) return;

  nodes.forEach((node, index) => {
    if (node.dataset.countupDone === 'true') return;
    node.dataset.countupDone = 'true';

    const targetValue = Number(node.dataset.countup || 0);
    const prefix = node.dataset.countupPrefix || '';
    const counter = { value: 0 };

    gsap.to(counter, {
      value: targetValue,
      duration: 1.2,
      delay: index * 0.08,
      ease: 'power2.out',
      onUpdate: () => {
        const nextValue = Math.round(counter.value);
        node.textContent = prefix ? `${prefix}${nextValue.toLocaleString('en-IN')}` : nextValue.toLocaleString('en-IN');
      }
    });
  });
}

function initOpsLaneTicker() {
  const rows = Array.from(document.querySelectorAll('#opsLane .ops-lane-row'));
  if (!rows.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let activeIndex = rows.findIndex((row) => row.classList.contains('is-live'));
  if (activeIndex < 0) activeIndex = 0;

  const setActiveRow = (nextIndex) => {
    rows.forEach((row, index) => {
      row.classList.toggle('is-live', index === nextIndex);
    });

    gsap.fromTo(rows[nextIndex], { y: 4 }, { y: 0, duration: 0.28, ease: 'power2.out' });
  };

  setActiveRow(activeIndex);
  opsLaneTimer = window.setInterval(() => {
    activeIndex = (activeIndex + 1) % rows.length;
    setActiveRow(activeIndex);
  }, 2400);
}

// ═══════════ CARD BACK ANIMATIONS ═══════════

function animateCardBack(cardEl, cardIndex) {
  if (cardIndex === 0) animateScanBack(cardEl);
  else if (cardIndex === 1) animateBarsBack(cardEl);
  else if (cardIndex === 2) animateSyncBack(cardEl);
}

const BACK_ANIM = {
  delay: 0.1,
  rowStagger: 0.14,
  rowDuration: 0.28,
  accentDuration: 0.22,
  ease: 'power2.out'
};

function animateScanBack(card) {
  const rows = card.querySelectorAll('.scan-row');
  const badges = card.querySelectorAll('.scan-badge');
  gsap.set(rows, { opacity: 0, y: 6 });
  gsap.set(badges, { scale: 0.9, opacity: 0 });
  const tl = gsap.timeline({ delay: BACK_ANIM.delay });
  tl.to(rows, {
    opacity: 1,
    y: 0,
    stagger: BACK_ANIM.rowStagger,
    duration: BACK_ANIM.rowDuration,
    ease: BACK_ANIM.ease
  });
  tl.to(
    badges,
    { scale: 1, opacity: 1, stagger: BACK_ANIM.rowStagger, duration: BACK_ANIM.accentDuration, ease: 'back.out(1.8)' },
    '-=0.38'
  );
}

function animateBarsBack(card) {
  const rows = card.querySelectorAll('.bar-row');
  const fills = card.querySelectorAll('.bar-fill');
  gsap.set(rows, { opacity: 0, y: 6 });
  gsap.set(fills, { width: '0%' });
  const tl = gsap.timeline({ delay: BACK_ANIM.delay });
  tl.to(rows, {
    opacity: 1,
    y: 0,
    stagger: BACK_ANIM.rowStagger,
    duration: BACK_ANIM.rowDuration,
    ease: BACK_ANIM.ease
  });

  fills.forEach((fill, i) => {
    const w = fill.dataset.w || '60';
    tl.to(
      fill,
      { width: `${w}%`, duration: 0.46, ease: 'power3.out' },
      i * BACK_ANIM.rowStagger + 0.06
    );
  });
}

function animateSyncBack(card) {
  const rows = card.querySelectorAll('.sync-row');
  const ticks = card.querySelectorAll('.sync-tick');
  rows.forEach((row) => row.classList.remove('is-synced'));
  gsap.set(rows, { opacity: 0, y: 6 });
  gsap.set(ticks, { opacity: 0, scale: 0.9 });
  const tl = gsap.timeline({ delay: BACK_ANIM.delay });

  tl.to(rows, {
    opacity: 1,
    y: 0,
    stagger: BACK_ANIM.rowStagger,
    duration: BACK_ANIM.rowDuration,
    ease: BACK_ANIM.ease
  });

  rows.forEach((row, i) => {
    tl.to(
      row.querySelector('.sync-tick'),
      { opacity: 1, scale: 1, duration: BACK_ANIM.accentDuration, ease: 'back.out(1.8)' },
      i * BACK_ANIM.rowStagger + 0.16
    );
    tl.add(() => row.classList.add('is-synced'), i * BACK_ANIM.rowStagger + 0.18);
  });
}

function stopProductDemo() {
  if (productDemoTimer) {
    clearInterval(productDemoTimer);
    productDemoTimer = null;
  }
}

function startProductDemo() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (productDemoTimer) return;

  const cards = Array.from(document.querySelectorAll('.flip-card'));
  if (!cards.length) return;

  let demoIndex = 0;

  const runStep = () => {
    cards.forEach((card) => {
      card.classList.remove('is-flipped', 'demo-focus');
      card.setAttribute('aria-pressed', 'false');
    });

    const target = cards[demoIndex];
    target.classList.add('is-flipped', 'demo-focus');
    target.setAttribute('aria-pressed', 'true');
    animateCardBack(target, demoIndex);

    gsap.fromTo(target, { y: 0 }, { y: -6, duration: 0.25, yoyo: true, repeat: 1, ease: 'sine.inOut' });
    demoIndex = (demoIndex + 1) % cards.length;
  };

  // Start after initial entrance animations.
  setTimeout(runStep, 1800);
  productDemoTimer = setInterval(runStep, 2600);

  // Stop autoplay once user starts interacting.
  const stopHandler = () => stopProductDemo();
  document.addEventListener('pointerdown', stopHandler, { once: true });
  document.addEventListener('keydown', stopHandler, { once: true });
}

function initFlipCards() {
  const cards = Array.from(document.querySelectorAll('.flip-card'));

  const triggerFlipAnimation = (card, index) => {
    const now = Date.now();
    const lastRun = Number(card.dataset.flipAnimAt || 0);
    if (now - lastRun < 420) return;
    card.dataset.flipAnimAt = String(now);
    animateCardBack(card, index);
  };

  cards.forEach((card, index) => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-pressed', 'false');
    card.setAttribute('aria-label', `Flip card ${index + 1}`);

    card.addEventListener('mouseenter', () => {
      stopProductDemo();
      // Hover instantly flips via CSS; this aligns back-panel animation with that flip.
      setTimeout(() => triggerFlipAnimation(card, index), 90);
    });

    card.addEventListener('focus', () => {
      triggerFlipAnimation(card, index);
    });

    card.addEventListener('click', (e) => {
      if (e.target.closest('button, a, input, label')) return;
      const isFlipped = card.classList.toggle('is-flipped');
      card.setAttribute('aria-pressed', String(isFlipped));
      if (isFlipped) triggerFlipAnimation(card, index);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      if (e.target.closest('button, a, input, label')) return;
      e.preventDefault();
      const isFlipped = card.classList.toggle('is-flipped');
      card.setAttribute('aria-pressed', String(isFlipped));
      if (isFlipped) triggerFlipAnimation(card, index);
    });
  });

  document.addEventListener('click', (e) => {
    if (e.target.closest('.flip-card')) return;
    cards.forEach((card) => {
      card.classList.remove('is-flipped');
      card.setAttribute('aria-pressed', 'false');
    });
  });
}

chooseBtn?.addEventListener('click', () => fileInput?.click());

fileInput?.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if(!file) return;

  const truncName = file.name.length > 20 ? file.name.substring(0, 20) + "..." : file.name;
  fileName.textContent = truncName;
  fileName.style.color = 'var(--text-main)';
  
  const landing = document.getElementById('landing-container');
  gsap.to(landing, { opacity: 0, y: -20, duration: 0.3, onComplete: () => {
    landing.classList.remove('active');
    stepUpload.classList.remove('hidden');
    stepUpload.classList.add('active');
    gsap.fromTo(stepUpload, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 });
    
    analyzeBtn.classList.remove('hidden');
    gsap.fromTo(analyzeBtn, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, delay: 0.2, ease: "back.out(1.5)" });
  }});

  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        fullText += textContent.items.map(s => s.str).join(" ") + " ";
    }
    policyText = fullText.toLowerCase();
  } catch(err) {
    fileName.textContent = "Parse failed. Simulated baseline.";
  }
});

analyzeBtn.addEventListener('click', async () => {
  if(!policyText) policyText = "baseline: depreciation, consumables, no-hydrostatic.";
  
  gsap.to(stepUpload, { opacity: 0, y: -20, duration: 0.3, onComplete: () => {
    stepUpload.classList.remove('active');
    stepProcessing.classList.remove('hidden');
    stepProcessing.classList.add('active');
    gsap.fromTo(stepProcessing, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 });
    runSwarmAudit();
  }});
});

async function runSwarmAudit() {
  const delay = ms => new Promise(res => setTimeout(res, ms));
  function setAgentStatus(id, activeMsg, doneMsg) {
    const el = document.getElementById(id);
    const dot = el.querySelector('.dot');
    const msg = el.querySelector('.agent-msg');
    return {
      activate: () => { el.classList.add('active'); msg.textContent = activeMsg; },
      complete: () => { el.classList.remove('active'); el.classList.add('done'); dot.className = 'dot check'; msg.textContent = doneMsg; }
    };
  }

  const ingest = setAgentStatus('agent-ingest', 'Extracting data...', 'Done');
  ingest.activate(); await delay(1000); ingest.complete();

  const clause = setAgentStatus('agent-clause', 'Running comparisons...', 'Done');
  clause.activate(); await delay(1200);
  
  if (policyText.includes('depreciation') || policyText.includes('consumables')) {
    state.finePrint.push("Consumable parts excluded.");
    state.score += 40;
  }
  if (policyText.includes('hydrostatic') || !policyText.includes('engine protect')) {
    state.finePrint.push("Engine water-logging fully excluded.");
    state.score += 35;
  }
  if (state.finePrint.length === 0) state.score = 15;
  
  clause.complete();

  const sim = setAgentStatus('agent-sim', 'Mapping collision data...', 'Done');
  sim.activate(); await delay(1200);
  
  state.oop = state.score > 50 ? "₹2,45,000" : "₹85,000";
  if (state.finePrint.some(fp => fp.includes("water-logging"))) {
    state.oop2 = "₹12,00,000"; state.hydroExcluded = "-₹12,00,000";
  } else {
    state.oop2 = "₹50,000"; state.hydroExcluded = "₹0 (Covered)";
  }
  state.fixes.push("Add Zero Depreciation Cover.");
  state.fixes.push("Require Engine Protection Add-on.");
  
  sim.complete(); await delay(600);
  transitionToResults();
}

function transitionToResults() {
  gsap.to(stepProcessing, { opacity: 0, y: -20, duration: 0.3, onComplete: () => {
    stepProcessing.classList.remove('active');
    stepResults.classList.remove('hidden');
    stepResults.classList.add('active');
    
    const scoreObj = { val: 0 };
    gsap.to(scoreObj, {
      val: state.score, duration: 1.5, ease: "power3.out",
      onUpdate: () => document.getElementById('shockScore').textContent = Math.round(scoreObj.val)
    });

    document.getElementById('oopScore').textContent = state.oop;
    document.getElementById('oopScore2').textContent = state.oop2;
    document.getElementById('hydroExcluded').textContent = state.hydroExcluded;
    
    setTimeout(() => {
      document.getElementById('shockProgress').style.width = `${state.score}%`;
    }, 400);

    const fpList = document.getElementById('finePrintList');
    if(state.finePrint.length === 0) fpList.innerHTML = "<li>No critical exclusions.</li>";
    else fpList.innerHTML = state.finePrint.map(fp => `<li>${fp}</li>`).join('');
    document.getElementById('fixList').innerHTML = state.fixes.map(f => `<li>${f}</li>`).join('');

    const tl = gsap.timeline();
    tl.fromTo(stepResults, { opacity: 0 }, { opacity: 1, duration: 0.2 })
      .fromTo('.results-header', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" })
      .fromTo('.metric-card, .insight-card, .scenario-card', { y: 30, opacity: 0, skewY: 2 }, { y: 0, opacity: 1, skewY: 0, stagger: 0.1, duration: 0.5, ease: "back.out(1.2)" }, "-=0.2")
      .fromTo('.action-footer', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, "-=0.2");
  }});
}

document.getElementById('resetBtn').addEventListener('click', () => location.reload());

// --- Credit Card Flow Logic ---
const ccOptimizeBtn = document.getElementById('ccOptimizeBtn');
const stepCcUpload = document.getElementById('step-cc-upload');
const simulatePlaidBtn = document.getElementById('simulatePlaidBtn');
const chooseCcFileBtn = document.getElementById('chooseCcFileBtn');
const ccPolicyFile = document.getElementById('ccPolicyFile');
const ccFileName = document.getElementById('ccFileName');
const stepCcProcessing = document.getElementById('step-cc-processing');
const stepCcResults = document.getElementById('step-cc-results');

if(ccOptimizeBtn) {
  ccOptimizeBtn.addEventListener('click', () => {
    const landing = document.getElementById('landing-container');
    gsap.to(landing, { opacity: 0, y: -20, duration: 0.3, onComplete: () => {
      landing.classList.remove('active');
      stepCcUpload.classList.remove('hidden');
      stepCcUpload.classList.add('active');
      gsap.fromTo(stepCcUpload, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 });
    }});
  });
}

if(chooseCcFileBtn) {
  chooseCcFileBtn.addEventListener('click', () => ccPolicyFile.click());
  ccPolicyFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if(!file) return;
    const truncName = file.name.length > 20 ? file.name.substring(0, 20) + "..." : file.name;
    ccFileName.textContent = truncName;
    ccFileName.style.color = 'var(--text-main)';
    simulatePlaidBtn.classList.remove('hidden');
    gsap.fromTo(simulatePlaidBtn, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, delay: 0.1, ease: "back.out(1.5)" });
  });
}

if(simulatePlaidBtn) {
  simulatePlaidBtn.addEventListener('click', () => {
    gsap.to(stepCcUpload, { opacity: 0, y: -20, duration: 0.3, onComplete: () => {
      stepCcUpload.classList.remove('active');
      stepCcProcessing.classList.remove('hidden');
      stepCcProcessing.classList.add('active');
      gsap.fromTo(stepCcProcessing, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 });
      runCcSwarmAudit();
    }});
  });
}

async function runCcSwarmAudit() {
  const delay = ms => new Promise(res => setTimeout(res, ms));
  function setAgentStatus(id, activeMsg, doneMsg) {
    const el = document.getElementById(id);
    const dot = el.querySelector('.dot');
    const msg = el.querySelector('.agent-msg');
    return {
      activate: () => { el.classList.add('active'); msg.textContent = activeMsg; },
      complete: () => { el.classList.remove('active'); el.classList.add('done'); dot.className = 'dot check'; msg.textContent = doneMsg; }
    };
  }

  const ingest = setAgentStatus('cc-agent-ingest', 'Parsing statement lines...', 'Done');
  ingest.activate(); await delay(1000); ingest.complete();

  const clause = setAgentStatus('cc-agent-clause', 'Running reward rules...', 'Done');
  clause.activate(); await delay(1200); clause.complete();

  const sim = setAgentStatus('cc-agent-sim', 'Maximizing rewards...', 'Done');
  sim.activate(); await delay(1000); sim.complete(); await delay(500);

  gsap.to(stepCcProcessing, { opacity: 0, y: -20, duration: 0.3, onComplete: () => {
    stepCcProcessing.classList.remove('active');
    stepCcResults.classList.remove('hidden');
    stepCcResults.classList.add('active');
    
    const tl = gsap.timeline();
    tl.fromTo(stepCcResults, { opacity: 0 }, { opacity: 1, duration: 0.2 })
      .fromTo('.results-header', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" })
      .fromTo('.results-layout > div', { y: 30, opacity: 0, skewY: 2 }, { y: 0, opacity: 1, skewY: 0, stagger: 0.15, duration: 0.5, ease: "back.out(1.2)" }, "-=0.2");
  }});
}

// Carousel Logic
let currentAngle = 0;
const carousel3d = document.getElementById('carousel3d');
window.rotateCarousel = function(dir) {
  currentAngle += dir * 120;
  if(carousel3d) carousel3d.style.transform = `rotateY(${currentAngle}deg)`;
}
window.rotateCarouselTo = function(index) {
  // calculate closest angle. each item is index * -120deg
  const targetAngle = index * -120;
  const currentMod = currentAngle % 360;
  let diff = targetAngle - currentMod;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  currentAngle += diff;
  if(carousel3d) carousel3d.style.transform = `rotateY(${currentAngle}deg)`;
}

