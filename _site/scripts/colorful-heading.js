/**
 * Colorful Heading Hover Effect
 * Optimized for SEO: Text is split into spans dynamically in JS
 */

document.addEventListener('DOMContentLoaded', () => {
    const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Select all elements that should have the colorful effect
    // We include 'colorfulHeading' for backward compatibility with index.html
    const headings = document.querySelectorAll('.js-colorful-heading, #colorfulHeading');
    
    // Color palette from the design system
    const colors = [
        '#FB8304', // Princeton Orange
        '#40BFAE', // Ocean Mist
        '#FE3300', // Blazing Flame
        '#3d60e2'  // Savoy Blue
    ];

    const prepareHeadingLetters = (heading) => {
        if (heading.querySelectorAll('[data-letter]').length === 0) {
            const text = heading.textContent.trim();
            heading.innerHTML = '';
            heading.setAttribute('aria-label', text);
            [...text].forEach(char => {
                const span = document.createElement('span');
                span.setAttribute('data-letter', '');
                span.setAttribute('aria-hidden', 'true');
                if (char === ' ') {
                    span.innerHTML = '&nbsp;';
                } else {
                    span.textContent = char;
                }
                heading.appendChild(span);
            });
        }
        return heading.querySelectorAll('[data-letter]');
    };

    headings.forEach(heading => {
        const letters = prepareHeadingLetters(heading);
        const lettersArray = Array.from(letters);
        const letterIndexMap = new Map(lettersArray.map((letter, index) => [letter, index]));
        const nonSpaceLetters = lettersArray.filter(letter => letter.textContent.trim() !== '');

        // 2. Setup the Hover Logic
        const currentColors = new Map();

        const getRandomColorAvoidingNeighbors = (letterIndex, currentColor = null) => {
            const excludeColors = [];
            if (currentColor) {
                excludeColors.push(currentColor);
            }
            if (letterIndex > 0) {
                const prevLevelLetter = lettersArray[letterIndex - 1];
                if (prevLevelLetter.textContent.trim() !== '' && currentColors.has(prevLevelLetter)) {
                    excludeColors.push(currentColors.get(prevLevelLetter));
                }
            }
            if (letterIndex < lettersArray.length - 1) {
                const nextLevelLetter = lettersArray[letterIndex + 1];
                if (nextLevelLetter.textContent.trim() !== '' && currentColors.has(nextLevelLetter)) {
                    excludeColors.push(currentColors.get(nextLevelLetter));
                }
            }
            const availableColors = colors.filter(color => !excludeColors.includes(color));
            const colorPool = availableColors.length > 0 ? availableColors : colors.filter(color => color !== currentColor);
            const fallbackPool = colorPool.length > 0 ? colorPool : colors;
            return fallbackPool[Math.floor(Math.random() * fallbackPool.length)];
        };

        const getRandomColorDifferent = (currentColor = null) => {
            const pool = currentColor ? colors.filter(color => color !== currentColor) : colors;
            const fallbackPool = pool.length > 0 ? pool : colors;
            return fallbackPool[Math.floor(Math.random() * fallbackPool.length)];
        };

        if (supportsHover && !prefersReducedMotion) {
            const letterTimeouts = new Map();
            lettersArray.forEach((letter, index) => {
                if (letter.textContent.trim() === '') return;

                letter.addEventListener('mouseenter', () => {
                    if (letterTimeouts.has(letter)) {
                        clearTimeout(letterTimeouts.get(letter));
                        letterTimeouts.delete(letter);
                    }
                    letter.style.transitionDelay = '0s';
                    const randomColor = getRandomColorAvoidingNeighbors(index, currentColors.get(letter) || null);
                    letter.style.transitionDuration = '0.3s';
                    letter.style.color = randomColor;
                    currentColors.set(letter, randomColor);
                });

                letter.addEventListener('mouseleave', () => {
                    const timeout = setTimeout(() => {
                        letter.style.transitionDelay = '0s';
                        letter.style.transitionDuration = '';
                        letter.style.color = '';
                        currentColors.delete(letter);
                        letterTimeouts.delete(letter);
                    }, 2000);
                    letterTimeouts.set(letter, timeout);
                });
            });
        } else if (!supportsHover && !prefersReducedMotion) {
            const initialDelay = 3000;
            const staggerDelay = 100;
            const cycleDelay = 3000;
            let cycleTimeoutId = null;
            const portraitCircle = document.getElementById('portraitCircle');
            let portraitCircleColor = null;

            const applyRandomStagger = () => {
                const shuffledLetters = [...nonSpaceLetters].sort(() => Math.random() - 0.5);
                shuffledLetters.forEach((letter, staggerIndex) => {
                    setTimeout(() => {
                        const letterIndex = letterIndexMap.get(letter);
                        const randomColor = getRandomColorAvoidingNeighbors(letterIndex, currentColors.get(letter) || null);
                        letter.style.transitionDuration = '0.3s';
                        letter.style.color = randomColor;
                        currentColors.set(letter, randomColor);
                    }, staggerIndex * staggerDelay);
                });
                if (portraitCircle) {
                    const circleDelay = shuffledLetters.length * staggerDelay;
                    setTimeout(() => {
                        portraitCircleColor = getRandomColorDifferent(portraitCircleColor);
                        portraitCircle.style.transitionDuration = '0.3s';
                        portraitCircle.style.backgroundColor = portraitCircleColor;
                    }, circleDelay);
                }
            };

            const scheduleNextCycle = () => {
                if (document.hidden || nonSpaceLetters.length === 0) {
                    cycleTimeoutId = setTimeout(scheduleNextCycle, cycleDelay);
                    return;
                }
                applyRandomStagger();
                const cycleDuration = Math.max(0, (nonSpaceLetters.length - 1) * staggerDelay);
                cycleTimeoutId = setTimeout(scheduleNextCycle, cycleDuration + cycleDelay);
            };

            setTimeout(() => {
                scheduleNextCycle();
            }, initialDelay);
        }
    });

    // Special handling for the portrait circle (already in original script)
    if (supportsHover && !prefersReducedMotion) {
        const portraitCircle = document.getElementById('portraitCircle');
        if (portraitCircle) {
            let circleTimeout;
            portraitCircle.addEventListener('mouseenter', () => {
                if (circleTimeout) clearTimeout(circleTimeout);
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                portraitCircle.style.transitionDuration = '0.3s';
                portraitCircle.style.backgroundColor = randomColor;
            });

            portraitCircle.addEventListener('mouseleave', () => {
                circleTimeout = setTimeout(() => {
                    portraitCircle.style.transitionDuration = '';
                    portraitCircle.style.backgroundColor = '';
                }, 2000);
            });
        }
    }
});
