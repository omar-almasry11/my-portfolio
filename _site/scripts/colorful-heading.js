/**
 * Colorful Heading Hover Effect
 * Inspired by Coolors.co - letters change to vibrant colors on hover
 * and revert back to original color after a delay
 */

document.addEventListener('DOMContentLoaded', () => {
    const heading = document.getElementById('colorfulHeading');
    if (!heading) return;

    // Color palette from the design system
    const colors = [
        '#FB8304', // Princeton Orange
        '#40BFAE', // Ocean Mist
        '#FE3300', // Blazing Flame
        '#3d60e2'  // Savoy Blue (existing)
    ];

    // Get all letter spans
    const letters = heading.querySelectorAll('[data-letter]');
    
    // Track timeouts for each letter
    const letterTimeouts = new Map();
    
    // Track current color for each letter
    const currentColors = new Map();

    // Helper function to get a random color different from adjacent letters
    const getRandomColorAvoidingNeighbors = (letterIndex) => {
        const excludeColors = [];
        
        // Check previous letter (if exists and not a space)
        if (letterIndex > 0) {
            const prevLetter = letters[letterIndex - 1];
            if (prevLetter.textContent.trim() !== '' && currentColors.has(prevLetter)) {
                excludeColors.push(currentColors.get(prevLetter));
            }
        }
        
        // Check next letter (if exists and not a space)
        if (letterIndex < letters.length - 1) {
            const nextLetter = letters[letterIndex + 1];
            if (nextLetter.textContent.trim() !== '' && currentColors.has(nextLetter)) {
                excludeColors.push(currentColors.get(nextLetter));
            }
        }
        
        // Filter out colors that are used by adjacent letters
        const availableColors = colors.filter(color => !excludeColors.includes(color));
        
        // If all colors are excluded (unlikely with 4 colors), just use any color
        const colorPool = availableColors.length > 0 ? availableColors : colors;
        
        return colorPool[Math.floor(Math.random() * colorPool.length)];
    };

    letters.forEach((letter, index) => {
        // Skip spaces
        if (letter.textContent.trim() === '') return;

        letter.addEventListener('mouseenter', () => {
            // Clear any existing timeout for this letter
            if (letterTimeouts.has(letter)) {
                clearTimeout(letterTimeouts.get(letter));
                letterTimeouts.delete(letter);
            }

            // Remove any pending return transition
            letter.style.transitionDelay = '0s';
            
            // Pick a random color that's different from adjacent letters
            const randomColor = getRandomColorAvoidingNeighbors(index);
            letter.style.color = randomColor;
            
            // Track the current color
            currentColors.set(letter, randomColor);
        });

        letter.addEventListener('mouseleave', () => {
            // After 2 seconds, start the 0.4s transition back to original
            const timeout = setTimeout(() => {
                // Add the delay only for the return transition
                letter.style.transitionDelay = '0s'; // We already waited in JS
                
                // Reset to original color (CSS will handle the transition)
                letter.style.color = '';
                
                // Remove from current colors map
                currentColors.delete(letter);
                
                // Clean up timeout reference
                letterTimeouts.delete(letter);
            }, 2000);

            // Store timeout reference
            letterTimeouts.set(letter, timeout);
        });
    });
});
