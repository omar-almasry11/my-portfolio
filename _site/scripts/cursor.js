document.addEventListener("DOMContentLoaded", () => {
    const cursor = document.getElementById("custom-cursor");
    let mouseX = 0;
    let mouseY = 0;
    let isMoving = false;

    // Offset for fine-tuning the position
    const offsetX = 5; // Adjust to your liking
    const offsetY = -5;

    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (!isMoving) {
            isMoving = true;
            requestAnimationFrame(() => {
                cursor.style.transform = `translate(${mouseX + offsetX}px, ${mouseY + offsetY}px)`;
                isMoving = false;
            });
        }
    });
});