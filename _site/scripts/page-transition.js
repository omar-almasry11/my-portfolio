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

    // Helper to randomize colors and SAVE them, avoiding adjacent duplicates
    const randomizeAndStoreColors = () => {
        const newColors = [];
        const gridSize = 10; // 10x10 grid
        
        gridItems.forEach((item, index) => {
            let color;
            let attempts = 0;
            const maxAttempts = 10;
            
            do {
                color = colors[Math.floor(Math.random() * colors.length)];
                attempts++;
                
                // Check if this color is different from adjacent cells
                const row = Math.floor(index / gridSize);
                const col = index % gridSize;
                
                // Check left neighbor
                const leftIndex = index - 1;
                const hasLeftNeighbor = col > 0 && leftIndex >= 0;
                const leftColor = hasLeftNeighbor ? newColors[leftIndex] : null;
                
                // Check top neighbor
                const topIndex = index - gridSize;
                const hasTopNeighbor = row > 0 && topIndex >= 0;
                const topColor = hasTopNeighbor ? newColors[topIndex] : null;
                
                // Accept color if it's different from both neighbors (or no neighbors exist)
                if (color !== leftColor && color !== topColor) {
                    break;
                }
            } while (attempts < maxAttempts);
            
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
