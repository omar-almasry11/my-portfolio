/**
 * Hero accent cells — inverse mosaic (scroll out)
 * Matches testimonial pixel tiling, but squares start opaque (full color) and
 * scrub to transparent as the hero leaves the viewport.
 */
const parseFillFromBackgroundImage = (backgroundImage) => {
  if (!backgroundImage || backgroundImage === 'none') return null;
  const m = backgroundImage.match(/rgba?\([^)]+\)|#[a-fA-F0-9]{3,8}/);
  return m ? m[0] : null;
};

const HERO_CELL_SELECTORS = [
  '.hero-cell--amber-tl',
  '.hero-cell--soft-c3r1',
  '.hero-cell--light-c3r2',
  '.hero-cell--grey-bl',
  '.hero-cell--coral-r',
  '.hero-cell--fill-c4r5',
  '.hero-cell--fill-c5r5',
  '.hero-cell--fill-c6r5',
]
  .map((c) => `.hero-grid > .hero-cell${c}`)
  .join(',');

/**
 * Mobile path — CSS-variable driven, no GSAP.
 *
 * We write ONE custom property (`--p`) on each wrapper per rAF tick.
 * Each square has a pre-assigned random threshold `--t` (0..1) and its
 * opacity is computed by the browser's style engine via calc(). This
 * replaces GSAP's "write element.style.opacity on 100+ nodes per frame"
 * with "write 8 CSS vars, browser cascades". No JS per-square work, no
 * ScrollTrigger fighting iOS momentum.
 */
const initHeroCellPixelScrollMobile = () => {
  const grid = document.querySelector('.hero-grid');
  if (!grid) return;

  const CELL_TARGET = 40;
  const wrappers = [];
  let resizeTimer;
  let rafId = null;
  let inView = false;
  let lastGridWidth = -1;

  const teardown = () => {
    grid.querySelectorAll('.hero-cell-sq-wrapper').forEach((w) => w.remove());
    grid
      .querySelectorAll('.hero-cell--mosaic')
      .forEach((c) => c.classList.remove('hero-cell--mosaic'));
    wrappers.length = 0;
  };

  const build = () => {
    teardown();
    const cells = document.querySelectorAll(HERO_CELL_SELECTORS);
    if (!cells.length) return;

    cells.forEach((cell) => {
      const fill = parseFillFromBackgroundImage(getComputedStyle(cell).backgroundImage);
      if (!fill) return;
      const rect = cell.getBoundingClientRect();
      if (rect.width < 4 || rect.height < 4) return;

      const W = rect.width;
      const H = rect.height;
      const cols = Math.max(1, Math.round(W / CELL_TARGET));
      const s = W / cols;
      const rows = Math.max(1, Math.ceil(H / s));
      const lastRowPx = rows === 1 ? H : Math.max(1, H - (rows - 1) * s);
      const rowTemplate = rows === 1 ? `${H}px` : `repeat(${rows - 1}, ${s}px) ${lastRowPx}px`;

      cell.classList.add('hero-cell--mosaic');

      const wrapper = document.createElement('div');
      wrapper.className = 'hero-cell-sq-wrapper hero-cell-sq-wrapper--css';
      wrapper.style.cssText =
        'position:absolute;inset:0;z-index:1;' +
        `display:grid;grid-template-columns:repeat(${cols},${s}px);` +
        `grid-template-rows:${rowTemplate};pointer-events:none;--p:0;`;

      const frag = document.createDocumentFragment();
      const total = cols * rows;
      for (let i = 0; i < total; i++) {
        const sq = document.createElement('div');
        sq.className = 'hero-cell-sq';
        const t = Math.random().toFixed(3);
        sq.style.cssText = `background-color:${fill};--t:${t};`;
        frag.appendChild(sq);
      }
      wrapper.appendChild(frag);
      cell.appendChild(wrapper);
      wrappers.push(wrapper);
    });

    lastGridWidth = grid.offsetWidth;
  };

  const tick = () => {
    rafId = null;
    if (!wrappers.length) return;
    const rect = grid.getBoundingClientRect();
    const heroH = grid.offsetHeight || 1;
    const startLead = window.innerHeight * 0.05;
    const dissolvePx = Math.max(200, Math.round(heroH * 0.28));
    const scrolled = -rect.top + startLead;
    const progress = Math.max(0, Math.min(1, scrolled / dissolvePx));
    const p = progress.toFixed(3);
    for (let i = 0; i < wrappers.length; i++) {
      wrappers[i].style.setProperty('--p', p);
    }
  };

  const schedule = () => {
    if (rafId != null) return;
    rafId = requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        inView = e.isIntersecting;
      });
      if (inView) schedule();
    },
    { rootMargin: '100% 0px 100% 0px' }
  );
  io.observe(grid);

  window.addEventListener('scroll', () => { if (inView) schedule(); }, { passive: true });

  const rebuild = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const w = grid.offsetWidth;
      // iOS URL-bar show/hide fires resize without a width change — skip rebuild.
      if (lastGridWidth > 0 && w === lastGridWidth) {
        schedule();
        return;
      }
      build();
      schedule();
    }, 200);
  };
  window.addEventListener('resize', rebuild, { passive: true });
  window.addEventListener('orientationchange', rebuild, { passive: true });
  document.fonts?.ready?.then(() => { build(); schedule(); });

  build();
  schedule();
};

const initHeroCellPixelScroll = () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  if (window.innerWidth < 640) {
    initHeroCellPixelScrollMobile();
    return;
  }

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  const CELL_TARGET = 28;
  let resizeTimer;
  let lastHeroGridWidth = -1;

  const initGridScroll = ({ gridSelector, cellSelector, mosaicClass, triggerId }) => {
    const grid = document.querySelector(gridSelector);
    if (!grid) return;

    const teardown = () => {
      ScrollTrigger.getById(triggerId)?.kill();
      grid.querySelectorAll('.hero-cell-sq-wrapper').forEach((w) => w.remove());
      grid.querySelectorAll(`.${mosaicClass}`).forEach((c) => c.classList.remove(mosaicClass));
    };

    const build = () => {
      teardown();

      const cells = document.querySelectorAll(cellSelector);
      if (!cells.length) return;

      const allSquares = [];

      cells.forEach((cell) => {
        const fill = parseFillFromBackgroundImage(getComputedStyle(cell).backgroundImage);
        if (!fill) return;

        const rect = cell.getBoundingClientRect();
        if (rect.width < 4 || rect.height < 4) return;

        const W = rect.width;
        const H = rect.height;
        const cols = Math.max(1, Math.round(W / CELL_TARGET));
        const s = W / cols;
        const rows = Math.max(1, Math.ceil(H / s));
        /** Last row height so (rows - 1) * s + lastRow === H — avoids overflow past cell */
        const lastRowPx = rows === 1 ? H : Math.max(1, H - (rows - 1) * s);
        const rowTemplate =
          rows === 1 ? `${H}px` : `repeat(${rows - 1}, ${s}px) ${lastRowPx}px`;

        cell.classList.add(mosaicClass);

        const wrapper = document.createElement('div');
        wrapper.className = 'hero-cell-sq-wrapper';
        wrapper.style.cssText =
          'position:absolute;inset:0;z-index:1;' +
          `display:grid;grid-template-columns:repeat(${cols},${s}px);` +
          `grid-template-rows:${rowTemplate};pointer-events:none;`;

        const frag = document.createDocumentFragment();
        for (let i = 0; i < cols * rows; i++) {
          const sq = document.createElement('div');
          sq.className = 'hero-cell-sq';
          sq.style.cssText = `background-color:${fill};opacity:1;`;
          frag.appendChild(sq);
          allSquares.push(sq);
        }
        wrapper.appendChild(frag);
        cell.appendChild(wrapper);
      });

      if (!allSquares.length) {
        lastHeroGridWidth = grid.offsetWidth;
        return;
      }

      const heroH = grid.offsetHeight || 1;
      /** Scroll distance for a full dissolve — fraction of hero height, not the whole section exit */
      const dissolveScrollPx = Math.max(200, Math.round(heroH * 0.28));
      const startLeadPx = Math.round(window.innerHeight * 0.05);

      gsap.fromTo(
        allSquares,
        { opacity: 1 },
        {
          opacity: 0,
          ease: 'none',
          stagger: { each: 0.012, from: 'random' },
          scrollTrigger: {
            id: triggerId,
            trigger: grid,
            /** Begin a bit before hero top hits viewport top; end after fixed scroll, not full hero height */
            start: () => `top top-=${startLeadPx}`,
            end: () => `+=${dissolveScrollPx}`,
            /** Shorter scrub on touch: less rubber-band “bounce” reversing the fade */
            scrub: window.matchMedia('(pointer: coarse)').matches ? 0.2 : 0.45,
            fastScrollEnd: true,
            invalidateOnRefresh: true,
          },
        }
      );

      lastHeroGridWidth = grid.offsetWidth;
    };

    build();
    return build;
  };

  const homeBuild = initGridScroll({
    gridSelector: '.hero-grid',
    cellSelector: [
      '.hero-cell--amber-tl',
      '.hero-cell--soft-c3r1',
      '.hero-cell--light-c3r2',
      '.hero-cell--grey-bl',
      '.hero-cell--coral-r',
      '.hero-cell--fill-c4r5',
      '.hero-cell--fill-c5r5',
      '.hero-cell--fill-c6r5',
    ]
      .map((c) => `.hero-grid > .hero-cell${c}`)
      .join(','),
    mosaicClass: 'hero-cell--mosaic',
    triggerId: 'hero-cell-pixel-scroll',
  });

  window.addEventListener(
    'resize',
    () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const grid = document.querySelector('.hero-grid');
        if (!grid) return;
        const w = grid.offsetWidth;
        /** iOS Safari fires resize when the URL bar shows/hides; width is unchanged — skip rebuild to avoid a one-frame “flash” at opacity 1 */
        if (
          window.matchMedia('(pointer: coarse)').matches &&
          lastHeroGridWidth > 0 &&
          w === lastHeroGridWidth
        ) {
          ScrollTrigger.refresh();
          return;
        }
        homeBuild?.();
      }, 200);
    },
    { passive: true }
  );

  window.addEventListener(
    'orientationchange',
    () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        homeBuild?.();
      }, 300);
    },
    { passive: true }
  );

  document.fonts?.ready?.then(() => ScrollTrigger.refresh());
};

window.addEventListener('load', initHeroCellPixelScroll);
