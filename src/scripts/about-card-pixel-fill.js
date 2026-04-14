/**
 * About cards pixel fill
 *
 * Adds a testimonial-like tiled overlay that reveals on scroll.
 * Scoped to .about-pixel-card so no other cards are affected.
 */
const initAboutCardPixelFill = () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  const CARD_SELECTOR = '.about-pixel-card';
  const CELL_TARGET = 28;
  const palette = ['#C48A1E', '#8A9BB5', '#4A5C8A', '#2A4494'];
  let resizeTimer;

  const teardown = () => {
    ScrollTrigger.getAll().forEach((st) => {
      if (st.trigger && st.trigger.matches && st.trigger.matches(CARD_SELECTOR)) {
        st.kill();
      }
    });

    document.querySelectorAll(`${CARD_SELECTOR} .about-pixel-sq-wrapper`).forEach((w) => w.remove());
    document.querySelectorAll(`${CARD_SELECTOR}.about-pixel-card--has-squares`).forEach((c) => {
      c.classList.remove('about-pixel-card--has-squares');
    });
  };

  const build = () => {
    teardown();

    const cards = document.querySelectorAll(CARD_SELECTOR);
    if (!cards.length) return;

    cards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      if (rect.width < 4 || rect.height < 4) return;

      const W = rect.width;
      const H = rect.height;
      const cols = Math.max(1, Math.round(W / CELL_TARGET));
      const s = W / cols;
      const rows = Math.max(1, Math.ceil(H / s));
      const color = palette[index % palette.length];

      card.classList.add('about-pixel-card--has-squares');

      const wrapper = document.createElement('div');
      wrapper.className = 'about-pixel-sq-wrapper';
      wrapper.style.display = 'grid';
      wrapper.style.gridTemplateColumns = `repeat(${cols}, ${s}px)`;
      wrapper.style.gridTemplateRows = `repeat(${rows}, ${s}px)`;

      const frag = document.createDocumentFragment();
      for (let i = 0; i < cols * rows; i++) {
        const sq = document.createElement('div');
        sq.className = 'about-pixel-sq';
        sq.style.backgroundColor = color;
        sq.style.opacity = '0';
        frag.appendChild(sq);
      }

      wrapper.appendChild(frag);
      card.appendChild(wrapper);

      gsap.to(wrapper.querySelectorAll('.about-pixel-sq'), {
        opacity: 0.2,
        ease: 'none',
        stagger: {
          each: 0.01,
          from: 'random',
        },
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          end: 'center 60%',
          scrub: 0.35,
        },
      });
    });
  };

  build();

  window.addEventListener(
    'resize',
    () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(build, 200);
    },
    { passive: true }
  );
};

window.addEventListener('load', initAboutCardPixelFill);
