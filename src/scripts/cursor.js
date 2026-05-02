document.addEventListener('DOMContentLoaded', () => {
    const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!supportsHover) return;

    const cursor = document.querySelector('.cursor-wrapper');
    const cursorDot = document.querySelector('.cursor_dot');

    if (!cursor || !cursorDot) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    const lerp = (start, end, amt) => (1 - amt) * start + amt * end;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (cursorX === 0 && cursorY === 0) {
            cursorX = mouseX;
            cursorY = mouseY;
        }
    });

    const animate = () => {
        if (!isRunning) return;
        cursorX = lerp(cursorX, mouseX, 0.2);
        cursorY = lerp(cursorY, mouseY, 0.2);

        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;

        animationFrameId = requestAnimationFrame(animate);
    };

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let animationFrameId = null;
    let isRunning = false;

    function start() {
        if (isRunning || prefersReducedMotion.matches) return;
        isRunning = true;
        animationFrameId = requestAnimationFrame(animate);
    }

    function stop() {
        if (!isRunning) return;
        isRunning = false;
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    }

    function syncAnimationState() {
        if (document.hidden || prefersReducedMotion.matches) {
            stop();
            return;
        }
        start();
    }

    syncAnimationState();
    document.addEventListener('visibilitychange', syncAnimationState);
    prefersReducedMotion.addEventListener('change', syncAnimationState);

    const applyTextCursorMetrics = (el) => {
        const cs = getComputedStyle(el);
        const fontSize = parseFloat(cs.fontSize);
        if (!Number.isFinite(fontSize) || fontSize <= 0) return;

        const lhRaw = cs.lineHeight;
        let heightPx;
        if (lhRaw === 'normal') {
            heightPx = fontSize * 1.25;
        } else {
            const lhNum = parseFloat(lhRaw);
            heightPx = Number.isFinite(lhNum) ? lhNum * 0.9 : fontSize * 1.25;
        }
        heightPx = Math.round(Math.max(16, Math.min(heightPx, fontSize * 1.4)));

        const widthPx = Math.max(2, Math.round(fontSize * 0.085));
        cursorDot.style.setProperty('--cursor-text-w', `${widthPx}px`);
        cursorDot.style.setProperty('--cursor-text-h', `${heightPx}px`);
    };

    const clearTextCursorMetrics = () => {
        cursorDot.style.removeProperty('--cursor-text-w');
        cursorDot.style.removeProperty('--cursor-text-h');
    };

    const addHoverEffect = (selector, classesToAdd, classesToRemove = [], options = {}) => {
        const { syncTextCursorMetrics, excludeWithin } = options;
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            if (excludeWithin && el.closest(excludeWithin)) return;
            el.addEventListener('mouseenter', () => {
                if (syncTextCursorMetrics) applyTextCursorMetrics(el);
                classesToRemove.forEach(cls => {
                    cursorDot.classList.remove(cls);
                    if (cls.includes('top') || cls.includes('behind')) cursor.classList.remove(cls);
                });
                classesToAdd.forEach(cls => {
                    if (cls.includes('top') || cls.includes('behind')) cursor.classList.add(cls);
                    else cursorDot.classList.add(cls);
                });
            });
            el.addEventListener('mouseleave', () => {
                classesToAdd.forEach(cls => {
                    cursor.classList.remove(cls);
                    cursorDot.classList.remove(cls);
                });
                if (syncTextCursorMetrics) clearTextCursorMetrics();
            });
        });
    };

    const cursorDotResetClasses = [
        'scale-cursor-up',
        'scale-cursor-up-small',
        'scale-cursor-up-footer',
        'white-cursor',
        'black-cursor',
        'cta-section-cursor',
        'cursor-text',
        'brush-cursor',
        'pixel-cursor',
        'cursor-dot-fade',
    ];
    const stripCursorState = [...cursorDotResetClasses, 'cursor-top', 'cursor-behind'];

    // .menu_link uses attachGlowLinkCursor (defined below) instead of scale-cursor-up
    addHoverEffect('.button', ['white-cursor', 'cursor-top'], stripCursorState);
    addHoverEffect('#back-to-top', ['cursor-dot-fade'], stripCursorState);
    addHoverEffect('.logo, .theme-toggle', ['cursor-dot-fade'], stripCursorState);
    addHoverEffect('.case-study-cursor-card', ['cursor-dot-fade'], stripCursorState);
    // .footer-social-link uses attachGlowLinkCursor (defined below) instead of scale-cursor-up-footer
    addHoverEffect('.list-parent, .service-card', ['scale-cursor-up-small', 'black-cursor'], stripCursorState);
    addHoverEffect('.home-heading, .js-colorful-heading', ['scale-cursor-up-small', 'cursor-top'], stripCursorState);
    addHoverEffect('#portraitCircle', ['scale-cursor-up-small', 'cursor-top'], stripCursorState);

    addHoverEffect(
        'p:not(.home-heading), h1, h2, h3, h4, h5, h6, li, blockquote, figcaption, .prose p, .prose li, .prose blockquote',
        ['cursor-text'],
        stripCursorState,
        {
            syncTextCursorMetrics: true,
            excludeWithin: '.case-study-cursor-card, .cta-grid-container, .testimonial-swiper',
        }
    );

    const addMagneticEffect = (selector, strength = 0.4) => {
        const magneticElements = document.querySelectorAll(selector);
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
                targetX = (e.clientX - rect.left - rect.width / 2) * strength;
                targetY = (e.clientY - rect.top - rect.height / 2) * strength;
            });

            el.addEventListener('mouseleave', () => {
                isHovering = false;
                targetX = 0;
                targetY = 0;
            });
        });
    };

    addMagneticEffect('.menu_link', 0.4);
    addMagneticEffect('.footer-social-link', 0.28);

    const attachGlowLinkCursor = (link) => {
        link.addEventListener('mouseenter', (e) => {
            stripCursorState.forEach((cls) => {
                cursorDot.classList.remove(cls);
                cursor.classList.remove(cls);
            });
            clearTextCursorMetrics();
            cursorDot.classList.add('cursor-dot-fade');

            const rect = link.getBoundingClientRect();
            link.style.setProperty('--clip-x', `${e.clientX - rect.left}px`);
            link.style.setProperty('--clip-y', `${e.clientY - rect.top}px`);
            link.classList.add('card-glow-active');
        });
        link.addEventListener('mouseleave', (e) => {
            const rect = link.getBoundingClientRect();
            link.style.setProperty('--clip-x', `${e.clientX - rect.left}px`);
            link.style.setProperty('--clip-y', `${e.clientY - rect.top}px`);
            cursorDot.classList.remove('cursor-dot-fade');
            link.classList.remove('card-glow-active');
        });
    };

    document.querySelectorAll('.case-study-next-link, .case-study-prev-link').forEach(attachGlowLinkCursor);
    document.querySelectorAll('.menu_link').forEach(attachGlowLinkCursor);
    document.querySelectorAll('.footer-social-link').forEach(attachGlowLinkCursor);

    const ctaGridSection = document.querySelector('.cta-grid-container');
    if (ctaGridSection) {
        ctaGridSection.addEventListener('mouseenter', () => {
            stripCursorState.forEach((cls) => {
                cursorDot.classList.remove(cls);
                cursor.classList.remove(cls);
            });
            clearTextCursorMetrics();
            cursorDot.classList.add('cta-section-cursor');
        });
        ctaGridSection.addEventListener('mouseleave', () => {
            cursorDot.classList.remove('cta-section-cursor');
        });
    }

    document.querySelectorAll('.footer-cta-cursor-link').forEach((link) => {
        attachGlowLinkCursor(link);
        link.addEventListener('mouseleave', (e) => {
            const section = link.closest('.cta-grid-container');
            if (
                section &&
                e.relatedTarget instanceof Node &&
                section.contains(e.relatedTarget)
            ) {
                stripCursorState.forEach((cls) => {
                    cursorDot.classList.remove(cls);
                    cursor.classList.remove(cls);
                });
                clearTextCursorMetrics();
                cursorDot.classList.add('cta-section-cursor');
            }
        });
    });

});
