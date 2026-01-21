/**
 * GSAP Page Transition
 * 
 * Optimized for standard Multi-Page Applications (MPAs):
 * - Seamless handoff between pages using sessionStorage.
 * - Prevents color-jumping by matching end-state of Page A with start-state of Page B.
 */

const initPageTransitions = () => {
    const colors = ['#FB8304', '#40BFAE', '#FE3300', '#3d60e2', '#EDF060'];
    const loadGrid = document.querySelector(".load_grid");
    const gridItems = document.querySelectorAll(".load_grid-item");

    if (!loadGrid || gridItems.length === 0) return;

    // Helper to randomize colors and SAVE them
    const randomizeAndStoreColors = () => {
        const newColors = [];
        gridItems.forEach(item => {
            const color = colors[Math.floor(Math.random() * colors.length)];
            item.style.backgroundColor = color;
            newColors.push(color);
        });
        sessionStorage.setItem('transitionColors', JSON.stringify(newColors));
    };

    // 1. Initial animation on page load (Fading OUT the grid)
    const tlIn = gsap.timeline({
        onComplete: () => {
            gsap.set(loadGrid, { display: "none" });
            // Clear storage so a manual refresh generates new colors
            sessionStorage.removeItem('transitionColors');
        }
    });

    tlIn.to(gridItems, {
        opacity: 0,
        duration: 0.25,
        ease: "power1.inOut",
        stagger: {
            amount: 0.5,
            from: "random"
        }
    });

    // 2. Intercept link clicks for the "out" transition (Fading IN the grid)
    document.body.addEventListener("click", (e) => {
        const link = e.target.closest("a");

        if (link) {
            const href = link.getAttribute("href");
            const hostname = link.hostname;
            const target = link.getAttribute("target");

            if (
                hostname === window.location.hostname &&
                href &&
                !href.startsWith("#") &&
                !href.includes("mailto:") &&
                !href.includes("tel:") &&
                target !== "_blank"
            ) {
                // Avoid transition if clicking the same page
                if (link.pathname === window.location.pathname && link.search === window.location.search) {
                    return;
                }

                e.preventDefault();
                const destination = href;

                // Lock in the colors for the next page load
                randomizeAndStoreColors();
                
                gsap.set(loadGrid, { display: "grid" });
                
                const tlOut = gsap.timeline({
                    onComplete: () => {
                        window.location.href = destination;
                    }
                });

                tlOut.to(gridItems, {
                    opacity: 1,
                    duration: 0.25,
                    ease: "power1.inOut",
                    stagger: {
                        amount: 0.5,
                        from: "random"
                    }
                });
            }
        }
    });

    // 3. Handle back button / Safari BFCache
    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            window.location.reload();
        }
    });
};

// Start logic as soon as DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPageTransitions);
} else {
    initPageTransitions();
}
