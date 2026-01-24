/**
 * Colorful Heading Hover Effect
 * Optimized for SEO: Text is split into spans dynamically in JS
 */

document.addEventListener('DOMContentLoaded', () => {
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

    headings.forEach(heading => {
        // 1. Prepare for SEO: If the heading doesn't have spans yet, create them
        // This keeps the HTML source clean with just the title text
        if (heading.querySelectorAll('[data-letter]').length === 0) {
            const text = heading.textContent.trim();
            heading.innerHTML = ''; // Clear original text
            
            // Set aria-label for accessibility (SEO/Screen Readers still see the full text)
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

        // 2. Setup the Hover Logic
        const letters = heading.querySelectorAll('[data-letter]');
        const letterTimeouts = new Map();
        const currentColors = new Map();

        const getRandomColorAvoidingNeighbors = (letterIndex) => {
            const excludeColors = [];
            if (letterIndex > 0) {
                const prevLevelLetter = letters[letterIndex - 1];
                if (prevLevelLetter.textContent.trim() !== '' && currentColors.has(prevLevelLetter)) {
                    excludeColors.push(currentColors.get(prevLevelLetter));
                }
            }
            if (letterIndex < letters.length - 1) {
                const nextLevelLetter = letters[letterIndex + 1];
                if (nextLevelLetter.textContent.trim() !== '' && currentColors.has(nextLevelLetter)) {
                    excludeColors.push(currentColors.get(nextLevelLetter));
                }
            }
            const availableColors = colors.filter(color => !excludeColors.includes(color));
            const colorPool = availableColors.length > 0 ? availableColors : colors;
            return colorPool[Math.floor(Math.random() * colorPool.length)];
        };

        letters.forEach((letter, index) => {
            if (letter.textContent.trim() === '') return;

            letter.addEventListener('mouseenter', () => {
                if (letterTimeouts.has(letter)) {
                    clearTimeout(letterTimeouts.get(letter));
                    letterTimeouts.delete(letter);
                }
                letter.style.transitionDelay = '0s';
                const randomColor = getRandomColorAvoidingNeighbors(index);
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
    });

    // Special handling for the portrait circle (already in original script)
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
});
