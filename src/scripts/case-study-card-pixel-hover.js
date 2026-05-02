/**
 * Bento / case-study cards — CTA chip radial glow on pointer (same language as footer CTA links).
 */
const initCaseStudyCardCtaGlow = () => {
  const CARD_SELECTOR = '.case-study-cursor-card';
  const cards = Array.from(document.querySelectorAll(CARD_SELECTOR));
  if (!cards.length) return;

  const setClipFromEvent = (cta, event) => {
    const ctaRect = cta.getBoundingClientRect();
    const x = event.clientX - ctaRect.left;
    const y = event.clientY - ctaRect.top;
    cta.style.setProperty('--clip-x', `${x}px`);
    cta.style.setProperty('--clip-y', `${y}px`);
  };

  const bindCtaGlow = (card) => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const cta = card.querySelector('.card-cta-glow');
    if (!cta) return;

    const isInside = (x, y, rect) =>
      x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;

    const syncGlow = (e) => {
      if (e.pointerType === 'touch') return;
      const rect = cta.getBoundingClientRect();
      const inside = isInside(e.clientX, e.clientY, rect);

      if (inside) {
        setClipFromEvent(cta, e);
        cta.classList.add('card-glow-active');
      } else {
        cta.classList.remove('card-glow-active');
      }
    };

    card.addEventListener('pointerenter', syncGlow);
    card.addEventListener('pointermove', syncGlow);
    card.addEventListener('pointerleave', (e) => {
      if (e.pointerType === 'touch') return;
      cta.classList.remove('card-glow-active');
    });
  };

  cards.forEach(bindCtaGlow);
};

window.addEventListener('load', initCaseStudyCardCtaGlow);
