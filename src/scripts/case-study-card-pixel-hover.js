/**
 * Case study card pixel hover
 *
 * Uses the same tiled visual language as about/testimonial effects,
 * but triggers on pointer hover in/out.
 */
const initCaseStudyCardPixelHover = () => {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (typeof gsap === 'undefined') return;

  const CARD_SELECTOR = '.case-study-cursor-card';
  /** Larger tiles → far fewer pixels per card, far fewer GSAP tween targets on hover. */
  const CELL_TARGET = 64;
  const palette = ['#C48A1E', '#8A9BB5', '#4A5C8A', '#2A4494'];

  const cards = Array.from(document.querySelectorAll(CARD_SELECTOR));
  if (!cards.length) return;

  const buildOverlay = (card, index) => {
    const old = card.querySelector('.case-study-pixel-sq-wrapper');
    if (old) old.remove();

    const rect = card.getBoundingClientRect();
    if (rect.width < 4 || rect.height < 4) return null;

    const W = rect.width;
    const H = rect.height;
    const cols = Math.max(1, Math.round(W / CELL_TARGET));
    const s = W / cols;
    const rows = Math.max(1, Math.ceil(H / s));
    const color = palette[index % palette.length];

    const wrapper = document.createElement('div');
    wrapper.className = 'case-study-pixel-sq-wrapper';
    wrapper.style.display = 'grid';
    wrapper.style.gridTemplateColumns = `repeat(${cols}, ${s}px)`;
    wrapper.style.gridTemplateRows = `repeat(${rows}, ${s}px)`;

    const frag = document.createDocumentFragment();
    for (let i = 0; i < cols * rows; i++) {
      const sq = document.createElement('div');
      sq.className = 'case-study-pixel-sq';
      sq.style.backgroundColor = color;
      sq.style.opacity = '0';
      frag.appendChild(sq);
    }
    wrapper.appendChild(frag);
    card.appendChild(wrapper);
    return wrapper.querySelectorAll('.case-study-pixel-sq');
  };

  const bindCard = (card, index) => {
    /** squares is rebuilt on resize via a holder so listeners stay stable — Safari sometimes bails on the first build with rect.width=0 before layout settles. */
    const state = { squares: null };

    const rebuild = () => {
      state.squares = buildOverlay(card, index);
    };

    rebuild();

    const animateIn = (e) => {
      if (e.pointerType === 'touch') return;
      if (!state.squares || !state.squares.length) rebuild();
      if (!state.squares || !state.squares.length) return;
      gsap.killTweensOf(state.squares);
      gsap.to(state.squares, {
        opacity: 0.22,
        duration: 0.4,
        ease: 'power2.out',
        stagger: { amount: 0.24, from: 'random' },
      });
    };

    const animateOut = (e) => {
      if (e.pointerType === 'touch') return;
      if (!state.squares || !state.squares.length) return;
      gsap.killTweensOf(state.squares);
      gsap.to(state.squares, {
        opacity: 0,
        duration: 0.34,
        ease: 'power2.in',
        stagger: { amount: 0.2, from: 'random' },
      });
    };

    card.addEventListener('pointerenter', animateIn);
    card.addEventListener('pointerleave', animateOut);

    return rebuild;
  };

  const rebuilders = cards.map((card, index) => bindCard(card, index));

  const rebuildAll = () => rebuilders.forEach((fn) => fn());

  /** Safari often has 0-sized rects at the `load` event if images/fonts haven't laid out — re-run once they do. */
  if (document.fonts?.ready) document.fonts.ready.then(rebuildAll);
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(() => {
      // Coalesce via rAF so a burst of resizes triggers one rebuild.
      if (ro._raf) cancelAnimationFrame(ro._raf);
      ro._raf = requestAnimationFrame(rebuildAll);
    });
    cards.forEach((card) => ro.observe(card));
  }

  let resizeTimer;
  window.addEventListener(
    'resize',
    () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(rebuildAll, 200);
    },
    { passive: true }
  );
};

window.addEventListener('load', initCaseStudyCardPixelHover);
