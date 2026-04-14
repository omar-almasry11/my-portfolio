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

  const CELL_TARGET = 28;
  let resizeTimer;

  const build = () => {
    const blocks = document.querySelectorAll('.color-block');
    if (!blocks.length) return;

    blocks.forEach((block) => {
      // Tear down previous run
      const oldWrapper = block.querySelector('.cb-sq-wrapper');
      if (oldWrapper) oldWrapper.remove();
      block.classList.remove('cb-has-squares');

      const color = getComputedStyle(block).backgroundColor;
      if (!color || color === 'transparent' || color === 'rgba(0, 0, 0, 0)') return;

      const rect = block.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const W = rect.width;
      const H = rect.height;
      const cols = Math.max(1, Math.round(W / CELL_TARGET));
      const s = W / cols;
      const rows = Math.max(1, Math.ceil(H / s));

      block.classList.add('cb-has-squares');

      const wrapper = document.createElement('div');
      wrapper.className = 'cb-sq-wrapper';
      wrapper.style.cssText =
        `position:absolute;top:0;left:0;width:100%;height:100%;` +
        `display:grid;grid-template-columns:repeat(${cols},${s}px);` +
        `grid-template-rows:repeat(${rows},${s}px);`;

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
        },
      });
    });
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
