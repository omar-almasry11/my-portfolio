/**
 * Custom Cursor Logic
 * Responsible for tracking mouse movement and handling hover effects.
 */

document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.querySelector('.cursor-wrapper');
    const cursorDot = document.querySelector('.cursor_dot');

    if (!cursor || !cursorDot) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    // Movement smoothing factor (0 to 1)
    const lerp = (start, end, amt) => (1 - amt) * start + amt * end;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Initial positioning to prevent jump
        if (cursorX === 0 && cursorY === 0) {
            cursorX = mouseX;
            cursorY = mouseY;
        }
    });

    const animate = () => {
        cursorX = lerp(cursorX, mouseX, 0.2);
        cursorY = lerp(cursorY, mouseY, 0.2);

        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;

        requestAnimationFrame(animate);
    };

    animate();

    // Hover Effects Logic
    const addHoverEffect = (selector, classesToAdd, classesToRemove = []) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                classesToRemove.forEach(cls => {
                    cursorDot.classList.remove(cls);
                    if (cls.includes('top')) cursor.classList.remove(cls);
                });
                classesToAdd.forEach(cls => {
                    if (cls.includes('top')) cursor.classList.add(cls);
                    else cursorDot.classList.add(cls);
                });
            });
            el.addEventListener('mouseleave', () => {
                classesToAdd.forEach(cls => {
                    if (cls.includes('top')) cursor.classList.remove(cls);
                    else cursorDot.classList.remove(cls);
                });
            });
        });
    };

    // Menu links: Scale up big
    addHoverEffect('.menu_link', ['scale-cursor-up']);

    // Buttons & Theme Toggle & Back to Top: White color only (no scale) + Move to top
    addHoverEffect('.button, .theme-toggle, #back-to-top', ['white-cursor', 'cursor-top'], ['scale-cursor-up', 'scale-cursor-up-small']);

    // Footer Social Links: Scale up small (appears behind link like nav links)
    addHoverEffect('.footer-social-link', ['scale-cursor-up-small']);

    // Project links / Service cards: Scale up small + black
    addHoverEffect('.list-parent, .service-card', ['scale-cursor-up-small', 'black-cursor']);

    // Logo: Scale up small + black
    addHoverEffect('.logo', ['scale-cursor-up-small', 'black-cursor']);

    // Home Heading: Scale up small + gradient brush effect
    addHoverEffect('.home-heading', ['scale-cursor-up-small', 'gradient-cursor']);

    // Text links & Inline links: Hide custom cursor for better readability
    addHoverEffect('.text-link, footer p a, .prose a', ['cursor-hidden']);

    // Magnetic Effect for Navbar Links with Smooth LERP
    const magneticElements = document.querySelectorAll('.menu_link');
    magneticElements.forEach(el => {
        let targetX = 0;
        let targetY = 0;
        let currentX = 0;
        let currentY = 0;
        let isHovering = false;

        const lerpMagnetic = () => {
            if (!isHovering && Math.abs(currentX) < 0.01 && Math.abs(currentY) < 0.01) {
                el.style.transform = 'translate3d(0,0,0)';
                return;
            }

            currentX = lerp(currentX, targetX, 0.1);
            currentY = lerp(currentY, targetY, 0.1);

            el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
            requestAnimationFrame(lerpMagnetic);
        };

        el.addEventListener('mouseenter', () => {
            isHovering = true;
            lerpMagnetic();
        });

        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            // Calculate distance from center
            targetX = (e.clientX - rect.left - rect.width / 2) * 0.4;
            targetY = (e.clientY - rect.top - rect.height / 2) * 0.4;
        });

        el.addEventListener('mouseleave', () => {
            isHovering = false;
            targetX = 0;
            targetY = 0;
        });
    });
});
