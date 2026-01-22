/**
 * Dynamic Favicon Renderer
 * Animates the favicon background through a color palette
 */

(function() {
    const palette = ['#FB8304', '#40BFAE', '#FE3300', '#3d60e2', '#EDF060'];
    const portraitSrc = '/images/png/pixel-profile-picture.png';
    const transitionSpeed = 2000; // 2 seconds
    const fps = 30; // Frames per second for smooth interpolation

    let currentColorIndex = 0;
    let nextColorIndex = 1;
    let progress = 0;
    
    const canvas = document.createElement('canvas');
    canvas.width = 64; // High-res favicon
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    const img = new Image();
    img.src = portraitSrc;

    // Clear out existing favicon tags to prevent browser confusion
    const existingIcons = document.querySelectorAll("link[rel~='icon'], link[rel='apple-touch-icon']");
    existingIcons.forEach(el => el.parentNode.removeChild(el));

    let faviconLink = document.createElement('link');
    faviconLink.rel = 'icon';
    faviconLink.type = 'image/png';
    document.head.appendChild(faviconLink);

    // Also add apple-touch-icon for mobile if needed, though it won't animate there
    let appleIcon = document.createElement('link');
    appleIcon.rel = 'apple-touch-icon';
    document.head.appendChild(appleIcon);

    // Easing function for smoother transitions
    function easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    // Helper to interpolate between two colors
    function interpolateColor(color1, color2, factor) {
        // Apply easing to the factor
        const easedFactor = easeInOutQuad(factor);

        const r1 = parseInt(color1.substring(1, 3), 16);
        const g1 = parseInt(color1.substring(3, 5), 16);
        const b1 = parseInt(color1.substring(5, 7), 16);

        const r2 = parseInt(color2.substring(1, 3), 16);
        const g2 = parseInt(color2.substring(3, 5), 16);
        const b2 = parseInt(color2.substring(5, 7), 16);

        const r = Math.round(r1 + easedFactor * (r2 - r1));
        const g = Math.round(g1 + easedFactor * (g2 - g1));
        const b = Math.round(b1 + easedFactor * (b2 - b1));

        return `rgb(${r}, ${g}, ${b})`;
    }

    function draw() {
        if (!img.complete) return;

        progress += (1000 / fps) / transitionSpeed;
        
        if (progress >= 1) {
            progress = 0;
            currentColorIndex = nextColorIndex;
            nextColorIndex = (nextColorIndex + 1) % palette.length;
        }

        const color = interpolateColor(palette[currentColorIndex], palette[nextColorIndex], progress);

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw Circle Background
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        // Draw Portrait
        // Note: We might want to slighty scale the portrait to fit nicely in the circle
        const padding = 4;
        ctx.drawImage(img, padding, padding, canvas.width - (padding * 2), canvas.height - (padding * 2));

        // Update Favicon
        const dataUrl = canvas.toDataURL('image/png');
        faviconLink.href = dataUrl;
        appleIcon.href = dataUrl;
    }

    img.onload = () => {
        setInterval(draw, 1000 / fps);
    };
})();
