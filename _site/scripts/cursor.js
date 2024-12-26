document.addEventListener("DOMContentLoaded", () => {
    const cursor = document.getElementById("custom-cursor");
  
    document.addEventListener("mousemove", (e) => {
      const { clientX: mouseX, clientY: mouseY } = e;
  
      // Update the cursor position
      cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });
  
    // Optional: Add hover effects
    document.querySelectorAll("a, button").forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursor.style.transform = `scale(1.5)`;
      });
  
      el.addEventListener("mouseleave", () => {
        cursor.style.transform = `scale(1)`;
      });
    });
  });