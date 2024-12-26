document.addEventListener("DOMContentLoaded", function () {
    // Select the custom cursor element
    var cursor = document.getElementById("custom-cursor");
    if (!cursor) {
        console.error("Custom cursor element not found!");
        return;
    }

    console.log("Custom cursor found:", cursor);

    // Variables for mouse position
    var mouseX = 0;
    var mouseY = 0;

    // Offset for positioning
    var offsetX = 5;
    var offsetY = -5;

    // Update cursor position on mousemove
    document.addEventListener("mousemove", function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.transform = `translate(${mouseX + offsetX}px, ${mouseY + offsetY}px)`;
    });

    // Hover effect for navigation links
    var navLinks = document.querySelectorAll(".menu_link");
    if (navLinks.length === 0) {
        console.warn("No navigation links found with class 'menu_link'.");
        return;
    }

    navLinks.forEach(function (link) {
        link.addEventListener("mouseenter", function () {
            console.log("Hovering over:", this);
            // Add scaling and transition inline
            cursor.style.transform += " scale(6.0)";
            cursor.style.transition = "transform 0.3s ease-out";
        });

        link.addEventListener("mouseleave", function () {
            console.log("Leaving:", this);
            // Reset scaling
            cursor.style.transform = `translate(${mouseX + offsetX}px, ${mouseY + offsetY}px) scale(1.0)`;
            cursor.style.transition = "transform 0.3s ease-out";
        });
    });
});