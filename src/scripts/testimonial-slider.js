/**
 * Homepage testimonials — Swiper: continuous linear autoplay (marquee-style), loop, grab + drag.
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
  /* Slow linear drift between slides; shorter when reduced motion (no autoplay). */
  const IDLE_TRANSITION_MS = reduceMotion ? 400 : 16000;
  const SNAP_SPEED = 520;

  const swiper = new Swiper(el, {
    loop: true,
    loopAddBlankSlides: false,
    loopAdditionalSlides: 6,
    slidesPerView: 1.15,
    spaceBetween: 12,
    /* Long linear glide per slide index for marquee autoplay — lower = faster drift */
    speed: IDLE_TRANSITION_MS,
    grabCursor: true,
    simulateTouch: true,
    resistanceRatio: 0.85,
    /* Must be false or Swiper can “lock” the carousel and break infinite loop with few slides */
    watchOverflow: false,
    navigation: {
      prevEl: prevBtn,
      nextEl: nextBtn,
    },
    autoplay: reduceMotion
      ? false
      : {
          delay: 1,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
          waitForTransition: true,
        },
    breakpoints: {
      640: { slidesPerView: 2.15, spaceBetween: 16 },
      /* ~2.35×2 < 5 slides: loop stays on real clones; 3.15×2 needs blank slides */
      1024: { slidesPerView: 2.35, spaceBetween: 20 },
    },
  });

  const useMarqueeSpeed = () => {
    swiper.params.speed = IDLE_TRANSITION_MS;
  };
  const useSnapSpeed = () => {
    swiper.params.speed = SNAP_SPEED;
  };

  [prevBtn, nextBtn].forEach((btn) => {
    btn.addEventListener('pointerdown', useSnapSpeed, true);
  });

  let pausedFromDrag = false;
  swiper.on('sliderFirstMove', () => {
    useSnapSpeed();
    if (reduceMotion || !swiper.autoplay) return;
    swiper.autoplay.pause();
    pausedFromDrag = true;
  });

  const endDragPause = () => {
    if (!pausedFromDrag) return;
    pausedFromDrag = false;
    if (!reduceMotion && swiper.autoplay && !el.matches(':hover')) {
      swiper.autoplay.resume();
    }
  };

  swiper.on('transitionEnd', () => {
    useMarqueeSpeed();
    endDragPause();
  });
  swiper.on('touchEnd', () => {
    useMarqueeSpeed();
    endDragPause();
  });
};

window.addEventListener('load', initTestimonialSlider);
