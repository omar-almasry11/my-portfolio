/**
 * Color Block Mosaic Fill — Scroll-Scrubbed
 *
 * Each Mondrian color block is subdivided into small squares.
 * GSAP ScrollTrigger scrubs the staggered fill animation to the
 * scroll position: scroll down → squares fill in randomly,
 * scroll back up → animation reverses and squares disappear.
 *
 * Rebuilds on window resize so squares stay square at every viewport.
 */
const initColorBlockMosaicFill = () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  /** iOS: rubber-band scroll reverses scrub tweens; normalizeScroll fixes that. */
  if (window.matchMedia('(pointer: coarse)').matches) {
    if (typeof ScrollTrigger.normalizeScroll === 'function') {
      ScrollTrigger.normalizeScroll(true);
    }
    ScrollTrigger.config({ ignoreMobileResize: true });
  }

  const CELL_TARGET = 28;
  let resizeTimer;

  /** Mirrors :root / .cb--* in input.css — fallback if getComputedStyle is empty (Safari edge cases). */
  const CLASS_FALLBACK_COLORS = {
    'cb--gold-1': '#8a9bb5',
    'cb--blue': '#2a4494',
    'cb--navy-1': '#c48a1e',
    'cb--mid': '#4a5c8a',
  };

  const isTransparentColor = (value) => {
    if (!value || value === 'transparent') return true;
    const m = String(value).match(
      /rgba?\(\s*([\d.]+%?)\s*,\s*([\d.]+%?)\s*,\s*([\d.]+%?)(?:\s*,\s*([\d.]+%?))?\s*\)/i
    );
    if (m && m[4] !== undefined && parseFloat(m[4]) === 0) return true;
    return false;
  };

  const resolveBlockColor = (block) => {
    const computed = getComputedStyle(block).backgroundColor;
    if (!isTransparentColor(computed)) return computed;
    for (const token of block.classList) {
      if (CLASS_FALLBACK_COLORS[token]) return CLASS_FALLBACK_COLORS[token];
    }
    return null;
  };

  const refreshScrollTriggersSoon = () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => ScrollTrigger.refresh());
    });
  };

  const build = () => {
    const blocks = document.querySelectorAll('.color-block');
    if (!blocks.length) return;

    blocks.forEach((block) => {
      // Tear down previous run
      const oldWrapper = block.querySelector('.cb-sq-wrapper');
      if (oldWrapper) oldWrapper.remove();
      block.classList.remove('cb-has-squares');

      const color = resolveBlockColor(block);
      if (!color) return;

      const rect = block.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const W = rect.width;
      const H = rect.height;
      const cols = Math.max(1, Math.round(W / CELL_TARGET));
      const s = W / cols;
      const rows = Math.max(1, Math.ceil(H / s));
      const lastRowPx = rows === 1 ? H : Math.max(1, H - (rows - 1) * s);
      const rowTemplate =
        rows === 1 ? `${H}px` : `repeat(${rows - 1}, ${s}px) ${lastRowPx}px`;

      block.classList.add('cb-has-squares');

      const wrapper = document.createElement('div');
      wrapper.className = 'cb-sq-wrapper';
      wrapper.style.cssText =
        `position:absolute;inset:0;pointer-events:none;overflow:hidden;box-sizing:border-box;` +
        `display:grid;grid-template-columns:repeat(${cols},${s}px);` +
        `grid-template-rows:${rowTemplate};`;

      const frag = document.createDocumentFragment();
      for (let i = 0; i < cols * rows; i++) {
        const sq = document.createElement('div');
        sq.className = 'cb-sq';
        sq.style.backgroundColor = color;
        sq.style.opacity = '0';
        frag.appendChild(sq);
      }
      wrapper.appendChild(frag);
      block.appendChild(wrapper);

      const squares = wrapper.querySelectorAll('.cb-sq');

      gsap.to(squares, {
        opacity: 1,
        ease: 'none',
        stagger: {
          each: 0.02,
          from: 'random',
        },
        scrollTrigger: {
          trigger: block,
          start: 'top 90%',
          end: 'center 50%',
          scrub: 0.4,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
        },
      });
    });

    refreshScrollTriggersSoon();
    document.fonts?.ready?.then(() => ScrollTrigger.refresh());
  };

  build();

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger && st.trigger.classList.contains('color-block')) {
          st.kill();
        }
      });
      build();
    }, 200);
  });
};

window.addEventListener('load', initColorBlockMosaicFill);
