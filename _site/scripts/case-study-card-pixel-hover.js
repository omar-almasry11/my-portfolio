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
  /** Larger tiles → fewer pixels per card */
  const CELL_TARGET = 24;
  const palette = ['#C48A1E', '#8A9BB5', '#4A5C8A', '#2A4494'];

  const cards = Array.from(document.querySelectorAll(CARD_SELECTOR));
  if (!cards.length) return;

  const buildCard = (card, index) => {
    if (card._caseStudyPixelAbort) {
      card._caseStudyPixelAbort.abort();
    }
    const ac = new AbortController();
    card._caseStudyPixelAbort = ac;

    const old = card.querySelector('.case-study-pixel-sq-wrapper');
    if (old) old.remove();

    const rect = card.getBoundingClientRect();
    if (rect.width < 4 || rect.height < 4) return;

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

    const squares = wrapper.querySelectorAll('.case-study-pixel-sq');

    const animateIn = () => {
      gsap.killTweensOf(squares);
      gsap.to(squares, {
        opacity: 0.22,
        duration: 0.4,
        ease: 'power2.out',
        stagger: { amount: 0.24, from: 'random' },
      });
    };

    const animateOut = () => {
      gsap.killTweensOf(squares);
      gsap.to(squares, {
        opacity: 0,
        duration: 0.34,
        ease: 'power2.in',
        stagger: { amount: 0.2, from: 'random' },
      });
    };

    card.addEventListener('mouseenter', animateIn, { signal: ac.signal });
    card.addEventListener('mouseleave', animateOut, { signal: ac.signal });
  };

  cards.forEach((card, index) => buildCard(card, index));

  let resizeTimer;
  window.addEventListener(
    'resize',
    () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        cards.forEach((card, index) => buildCard(card, index));
      }, 200);
    },
    { passive: true }
  );
};

window.addEventListener('load', initCaseStudyCardPixelHover);
