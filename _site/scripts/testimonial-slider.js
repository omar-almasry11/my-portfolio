/**
 * Homepage testimonials — Swiper: loop, grab + drag, discrete slides (no marquee).
 *
 * Autoplay uses a normal delay + transition speed so arrows and autoplay stay in sync.
 * Root hover pauses autoplay for the track and the external arrow row.
 */
const initTestimonialSlider = () => {
  if (typeof Swiper === 'undefined') return;

  const el = document.getElementById('testimonial-slider');
  if (!el) return;

  const root = el.closest('.testimonial-slider-root');
  const prevBtn = root?.querySelector('.testimonial-swiper__arrow--prev');
  const nextBtn = root?.querySelector('.testimonial-swiper__arrow--next');
  if (!prevBtn || !nextBtn) return;

  const wrapper = el.querySelector('.swiper-wrapper');
  if (!wrapper) return;

  /*
   * Swiper loop needs enough real slides vs slidesPerView. Five testimonials + fractional
   * per-view can disable loop or stutter; clone the set once (aria-hidden) so loop is stable.
   */
  const MIN_SLIDES_FOR_LOOP = 8;
  const originals = Array.from(wrapper.querySelectorAll(':scope > .swiper-slide'));
  if (originals.length > 0 && originals.length < MIN_SLIDES_FOR_LOOP) {
    originals.forEach((slide) => {
      const copy = slide.cloneNode(true);
      copy.setAttribute('aria-hidden', 'true');
      wrapper.appendChild(copy);
    });
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SLIDE_SPEED_MS = reduceMotion ? 0 : 520;
  const AUTOPLAY_DELAY_MS = 6500;

  const swiper = new Swiper(el, {
    loop: true,
    loopAddBlankSlides: false,
    loopAdditionalSlides: 6,
    slidesPerView: 1.15,
    slidesPerGroup: 1,
    spaceBetween: 12,
    speed: SLIDE_SPEED_MS,
    grabCursor: true,
    simulateTouch: true,
    resistanceRatio: 0.85,
    watchOverflow: false,
    navigation: {
      prevEl: prevBtn,
      nextEl: nextBtn,
    },
    autoplay: reduceMotion
      ? false
      : {
          delay: AUTOPLAY_DELAY_MS,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
          waitForTransition: true,
        },
    breakpoints: {
      640: { slidesPerView: 2.15, slidesPerGroup: 1, spaceBetween: 16 },
      1024: { slidesPerView: 2.35, slidesPerGroup: 1, spaceBetween: 20 },
    },
  });

  let pausedFromDrag = false;

  const tryResumeAutoplay = () => {
    if (reduceMotion || !swiper.autoplay || pausedFromDrag) return;
    if (root.matches(':hover')) return;
    swiper.autoplay.resume();
  };

  if (!reduceMotion && swiper.autoplay) {
    root.addEventListener('mouseenter', () => {
      swiper.autoplay.pause();
    });
    root.addEventListener('mouseleave', () => {
      tryResumeAutoplay();
    });
  }

  swiper.on('sliderFirstMove', () => {
    if (reduceMotion || !swiper.autoplay) return;
    swiper.autoplay.pause();
    pausedFromDrag = true;
  });

  const endDragPause = () => {
    if (!pausedFromDrag) return;
    pausedFromDrag = false;
    tryResumeAutoplay();
  };

  swiper.on('transitionEnd', () => {
    endDragPause();
  });

  swiper.on('touchEnd', () => {
    endDragPause();
  });
};

window.addEventListener('load', initTestimonialSlider);
