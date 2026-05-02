/**
 * CTA Grid Animation
 * Cycles through brand colors with a reveal animation effect.
 */

(function () {
    const ctaGrid = document.querySelector('.cta-grid');
    if (!ctaGrid) return;

    const gridItems = document.querySelectorAll('.cta-grid-item');
    /** Mosaic cycle — cool tones only (no gold); keep in sync with .cta-grid in input.css */
    const colors = ['#8A9BB5', '#4A5C8A', '#2A4494', '#4A6AB0'];

    let currentColorIndex = 0;
    let nextColorIndex = 1;

    const initializeGrid = () => {
        const c = colors[currentColorIndex];
        ctaGrid.style.backgroundColor = c;
        gridItems.forEach((item) => {
            item.style.backgroundColor = c;
            item.style.opacity = '1';
        });
    };

    const cycleColors = () => {
        ctaGrid.style.backgroundColor = colors[nextColorIndex];

        const tl = gsap.timeline({
            onComplete: () => {
                gridItems.forEach((item) => {
                    item.style.backgroundColor = colors[nextColorIndex];
                });

                gsap.to(gridItems, {
                    opacity: 1,
                    duration: 0.5,
                    ease: 'power2.inOut',
                    stagger: {
                        amount: 0.85,
                        from: 'random',
                    },
                    onComplete: () => {
                        currentColorIndex = nextColorIndex;
                        nextColorIndex = (nextColorIndex + 1) % colors.length;
                    },
                });
            },
        });

        tl.to(gridItems, {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.inOut',
            stagger: {
                amount: 0.85,
                from: 'random',
            },
        });
    };

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let isVisible = true;
    let intervalId = null;

    function start() {
        if (intervalId || prefersReducedMotion.matches) return;
        intervalId = setInterval(cycleColors, 3200);
    }

    function stop() {
        if (!intervalId) return;
        clearInterval(intervalId);
        intervalId = null;
    }

    function syncAnimationState() {
        if (document.hidden || !isVisible) {
            stop();
            return;
        }

        if (prefersReducedMotion.matches) {
            stop();
            return;
        }

        start();
    }

    initializeGrid();
    syncAnimationState();

    if ('IntersectionObserver' in window) {
        const ctaGridObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    isVisible = entry.isIntersecting;
                    syncAnimationState();
                });
            },
            { rootMargin: '200px 0px', threshold: 0.1 }
        );
        ctaGridObserver.observe(ctaGrid);
    }

    document.addEventListener('visibilitychange', syncAnimationState);
    prefersReducedMotion.addEventListener('change', syncAnimationState);
})();
