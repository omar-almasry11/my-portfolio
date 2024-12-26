document.addEventListener("DOMContentLoaded", () => {
    const cursor = document.getElementById("custom-cursor");
  
    document.addEventListener("mousemove", (e) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
  
      // Add an offset to align the dot closer or further
      const offsetX = 0; // Positive to move right, negative to move left
      const offsetY = 0; // Positive to move down, negative to move up
  
      // Adjust position
      cursor.style.transform = `translate(${mouseX + offsetX}px, ${mouseY + offsetY}px)`;
    });
  });