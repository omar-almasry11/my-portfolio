/**
 * CTA Grid Animation
 * Cycles through brand colors with a reveal animation effect
 */

(function() {
    const ctaGrid = document.querySelector('.cta-grid');
    if (!ctaGrid) return;

    const gridItems = document.querySelectorAll('.cta-grid-item');
    const colors = ['#FB8304', '#40BFAE', '#FE3300', '#EDF060']; // Orange, Teal, Red, Yellow
    
    let currentColorIndex = 0;
    let nextColorIndex = 1;

    // Initialize with first color
    const initializeGrid = () => {
        ctaGrid.style.backgroundColor = colors[currentColorIndex];
        gridItems.forEach(item => {
            item.style.backgroundColor = colors[currentColorIndex];
            item.style.opacity = '1';
        });
    };

    // Animation cycle function
    const cycleColors = () => {
        // Set the next background color (hidden behind grid)
        ctaGrid.style.backgroundColor = colors[nextColorIndex];

        // Animate grid items to fade out (reveal new color underneath)
        const tl = gsap.timeline({
            onComplete: () => {
                // Once faded out, switch grid items to new color
                gridItems.forEach(item => {
                    item.style.backgroundColor = colors[nextColorIndex];
                });

                // Fade grid items back in - slower and more gradual
                gsap.to(gridItems, {
                    opacity: 1,
                    duration: 0.6,
                    ease: "power1.inOut",
                    stagger: {
                        amount: 1.2,
                        from: "random"
                    },
                    onComplete: () => {
                        // Update color indices for next cycle
                        currentColorIndex = nextColorIndex;
                        nextColorIndex = (nextColorIndex + 1) % colors.length;
                    }
                });
            }
        });

        // Fade out with random stagger - slower and more gradual
        tl.to(gridItems, {
            opacity: 0,
            duration: 0.6,
            ease: "power1.inOut",
            stagger: {
                amount: 1.2,
                from: "random"
            }
        });
    };

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let isVisible = true;
    let intervalId = null;

    function start() {
        if (intervalId || prefersReducedMotion.matches) return;
        intervalId = setInterval(cycleColors, 4500);
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

    // Start the animation loop
    initializeGrid();
    syncAnimationState();

    if ('IntersectionObserver' in window) {
        const ctaGridObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                isVisible = entry.isIntersecting;
                syncAnimationState();
            });
        }, { rootMargin: '200px 0px', threshold: 0.1 });
        ctaGridObserver.observe(ctaGrid);
    }

    document.addEventListener('visibilitychange', syncAnimationState);
    prefersReducedMotion.addEventListener('change', syncAnimationState);
})();
