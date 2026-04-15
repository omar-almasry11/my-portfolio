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

  /**
   * Keep ignoreMobileResize so iOS URL-bar show/hide doesn't re-trigger refreshes,
   * but do NOT call normalizeScroll — on iOS/iPadOS Safari it hijacks native scroll
   * and produces the jerky / incomplete scrub the testimonials section was showing.
   * fastScrollEnd + invalidateOnRefresh on each trigger handle the rubber-band case.
   */
  ScrollTrigger.config({ ignoreMobileResize: true });

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

  /** Kill the ScrollTrigger whose trigger is this block, so rebuilding doesn't leave dupes. */
  const killBlockTrigger = (block) => {
    ScrollTrigger.getAll().forEach((st) => {
      if (st.trigger === block) st.kill();
    });
  };

  const buildBlock = (block) => {
    const oldWrapper = block.querySelector('.cb-sq-wrapper');
    if (oldWrapper) oldWrapper.remove();
    block.classList.remove('cb-has-squares');
    killBlockTrigger(block);

    const color = resolveBlockColor(block);
    if (!color) return;

    const rect = block.getBoundingClientRect();
    if (rect.width < 4 || rect.height < 4) return;

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
        /** Start only when the block's top actually enters the viewport — measurement-drift safe. */
        start: 'top bottom',
        end: 'center 60%',
        scrub: 0.4,
        fastScrollEnd: true,
        invalidateOnRefresh: true,
      },
    });
  };

  const build = () => {
    const blocks = document.querySelectorAll('.color-block');
    if (!blocks.length) return;
    blocks.forEach(buildBlock);
  };

  /**
   * Per-block ResizeObserver: lazy-loaded testimonial logos land later and change the
   * row heights that color blocks share with testimonial cards. Without this, the
   * pixel grid stays locked at the pre-load dimensions and shows as a tiny 1×1 or
   * partial fill. Only the block that actually changed size is rebuilt — no global
   * ScrollTrigger.refresh is needed, so there are no scroll jumps on Safari.
   *
   * ResizeObserver fires once on observe() with the current size, which doubles as
   * our initial build trigger. No separate idle-callback build needed.
   *
   * The size cache ignores sub-pixel noise so a stray layout poke doesn't thrash rebuilds.
   */
  const sizeCache = new WeakMap();
  const SIZE_EPSILON = 2;
  const scheduledRebuilds = new WeakMap();

  const onBlockResize = (block) => {
    const rect = block.getBoundingClientRect();
    const prev = sizeCache.get(block);
    if (
      prev &&
      Math.abs(prev.w - rect.width) < SIZE_EPSILON &&
      Math.abs(prev.h - rect.height) < SIZE_EPSILON
    ) {
      return;
    }
    sizeCache.set(block, { w: rect.width, h: rect.height });
    // Coalesce a burst of resize entries into a single rebuild per block.
    if (scheduledRebuilds.get(block)) return;
    scheduledRebuilds.set(block, true);
    requestAnimationFrame(() => {
      scheduledRebuilds.delete(block);
      buildBlock(block);
    });
  };

  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver((entries) => {
      entries.forEach((entry) => onBlockResize(entry.target));
    });
    document.querySelectorAll('.color-block').forEach((block) => ro.observe(block));
  } else {
    // Legacy fallback: no ResizeObserver, so build once and rely on window resize.
    if ('requestIdleCallback' in window) requestIdleCallback(build, { timeout: 800 });
    else setTimeout(build, 100);
  }

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(build, 200);
  });
};

window.addEventListener('load', initColorBlockMosaicFill);
