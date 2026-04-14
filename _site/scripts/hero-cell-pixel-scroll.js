/**
 * Hero accent cells — inverse mosaic (scroll out)
 * Matches testimonial pixel tiling, but squares start opaque (full color) and
 * scrub to transparent as the hero leaves the viewport.
 */
const initHeroCellPixelScroll = () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  const CELL_TARGET = 28;
  let resizeTimer;

  const parseFillFromBackgroundImage = (backgroundImage) => {
    if (!backgroundImage || backgroundImage === 'none') return null;
    const m = backgroundImage.match(/rgba?\([^)]+\)|#[a-fA-F0-9]{3,8}/);
    return m ? m[0] : null;
  };

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

      if (!allSquares.length) return;

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
            scrub: 0.45,
            invalidateOnRefresh: true,
          },
        }
      );
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
        homeBuild?.();
      }, 200);
    },
    { passive: true }
  );
};

window.addEventListener('load', initHeroCellPixelScroll);
